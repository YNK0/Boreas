import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { emailService } from '@/lib/email/email-service'
import { EMAIL_CONFIG } from '@/lib/email/resend-client'

// This endpoint should be called by a cron job to send scheduled follow-up emails
export async function POST(request: NextRequest) {
  try {
    // Security check
    const authHeader = request.headers.get('authorization')
    if (!authHeader || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const now = new Date()
    const results = {
      followup1: 0,
      followup2: 0,
      followup3: 0,
      errors: [] as string[]
    }

    const supabase = await createClient()

    // Process each follow-up sequence
    for (const [sequenceName, hoursDelay] of Object.entries(EMAIL_CONFIG.timing)) {
      if (sequenceName === 'welcome') continue // Skip welcome email

      const sequenceNumber = parseInt(sequenceName.replace('followup', ''))
      if (![1, 2, 3].includes(sequenceNumber)) continue

      // Calculate the time window for this sequence
      const targetTime = new Date(now.getTime() - (hoursDelay * 60 * 60 * 1000))
      const windowStart = new Date(targetTime.getTime() - (30 * 60 * 1000)) // 30 min before
      const windowEnd = new Date(targetTime.getTime() + (30 * 60 * 1000)) // 30 min after

      // Find leads that should receive this follow-up email
      // 1. Created within the time window
      // 2. Haven't received this specific follow-up yet
      // 3. Did receive the welcome email successfully
      const { data: candidateLeads, error: leadsError } = await supabase
        .from('leads')
        .select('id, name, email, company, business_type, created_at')
        .gte('created_at', windowStart.toISOString())
        .lte('created_at', windowEnd.toISOString()) as { data: any[] | null; error: any }

      if (leadsError) {
        console.error(`Error fetching leads for ${sequenceName}:`, leadsError)
        results.errors.push(`Failed to fetch leads for ${sequenceName}`)
        continue
      }

      if (!candidateLeads || candidateLeads.length === 0) {
        continue
      }

      // Check which leads haven't received this specific follow-up
      for (const lead of candidateLeads) {
        try {
          // Check if welcome email was sent successfully
          const { data: welcomeEmail } = await supabase
            .from('email_logs')
            .select('id')
            .eq('lead_id', lead.id)
            .eq('template_name', 'welcome')
            .eq('status', 'sent')
            .maybeSingle()

          if (!welcomeEmail) {
            continue // Skip if welcome wasn't sent
          }

          // Check if this follow-up was already sent
          const { data: existingFollowup } = await supabase
            .from('email_logs')
            .select('id')
            .eq('lead_id', lead.id)
            .eq('template_name', `followup_${sequenceNumber}`)
            .eq('status', 'sent')
            .maybeSingle()

          if (existingFollowup) {
            continue // Already sent
          }

          // Send the follow-up email
          const emailResult = await emailService.sendFollowupEmail(
            {
              name: lead.name,
              email: lead.email,
              businessType: lead.business_type,
              company: lead.company
            },
            sequenceNumber as 1 | 2 | 3,
            lead.id
          )

          if (emailResult.success) {
            (results as any)[`followup${sequenceNumber}`] += 1
          } else {
            results.errors.push(`Failed to send ${sequenceName} to ${lead.email}: ${emailResult.error}`)
          }

          // Add a small delay to avoid rate limits
          await new Promise(resolve => setTimeout(resolve, 100))

        } catch (error) {
          const errorMsg = `Error processing lead ${lead.id} for ${sequenceName}: ${error}`
          console.error(errorMsg)
          results.errors.push(errorMsg)
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Scheduled emails processed',
      results,
      processedAt: now.toISOString()
    })

  } catch (error) {
    console.error('Error in scheduled email trigger:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET endpoint to show what emails would be sent (dry run)
export async function GET(request: NextRequest) {
  try {
    const now = new Date()
    const preview = {
      followup1: [] as any[],
      followup2: [] as any[],
      followup3: [] as any[]
    }

    const supabase = await createClient()

    // Preview each follow-up sequence
    for (const [sequenceName, hoursDelay] of Object.entries(EMAIL_CONFIG.timing)) {
      if (sequenceName === 'welcome') continue

      const sequenceNumber = parseInt(sequenceName.replace('followup', ''))
      if (![1, 2, 3].includes(sequenceNumber)) continue

      const targetTime = new Date(now.getTime() - (hoursDelay * 60 * 60 * 1000))
      const windowStart = new Date(targetTime.getTime() - (30 * 60 * 1000))
      const windowEnd = new Date(targetTime.getTime() + (30 * 60 * 1000))

      const { data: candidateLeads } = await supabase
        .from('leads')
        .select('id, name, email, company, business_type, created_at')
        .gte('created_at', windowStart.toISOString())
        .lte('created_at', windowEnd.toISOString()) as { data: any[] | null }

      if (candidateLeads) {
        for (const lead of candidateLeads) {
          // Check conditions
          const { data: welcomeEmail } = await supabase
            .from('email_logs')
            .select('id')
            .eq('lead_id', lead.id)
            .eq('template_name', 'welcome')
            .eq('status', 'sent')
            .maybeSingle()

          const { data: existingFollowup } = await supabase
            .from('email_logs')
            .select('id')
            .eq('lead_id', lead.id)
            .eq('template_name', `followup_${sequenceNumber}`)
            .eq('status', 'sent')
            .maybeSingle()

          if (welcomeEmail && !existingFollowup) {
            (preview as any)[`followup${sequenceNumber}`].push({
              leadId: lead.id,
              name: lead.name,
              email: lead.email,
              company: lead.company,
              businessType: lead.business_type,
              createdAt: lead.created_at,
              scheduledFor: targetTime.toISOString()
            })
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Email schedule preview',
      preview,
      currentTime: now.toISOString()
    })

  } catch (error) {
    console.error('Error in email schedule preview:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}