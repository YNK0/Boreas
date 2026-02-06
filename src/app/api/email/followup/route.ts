import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { emailService } from '@/lib/email/email-service'

// This endpoint can be used to manually trigger follow-up emails
// or by a cron job/job queue system
export async function POST(request: NextRequest) {
  try {
    // For security, you might want to add authentication here
    const authHeader = request.headers.get('authorization')
    if (!authHeader || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { leadId, sequence } = body

    if (!leadId || !sequence || ![1, 2, 3].includes(sequence)) {
      return NextResponse.json(
        { error: 'leadId and sequence (1, 2, or 3) are required' },
        { status: 400 }
      )
    }

    // Get lead data from database
    const supabase = await createClient()
    const { data: lead, error } = await supabase
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .single() as { data: any; error: any }

    if (error || !lead) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      )
    }

    // Check if this sequence email was already sent
    const { data: existingEmail } = await supabase
      .from('email_logs')
      .select('id')
      .eq('lead_id', leadId)
      .eq('template_name', `followup_${sequence}`)
      .eq('status', 'sent')
      .maybeSingle()

    if (existingEmail) {
      return NextResponse.json(
        { error: `Followup ${sequence} already sent for this lead` },
        { status: 409 }
      )
    }

    // Send the follow-up email
    const emailResult = await emailService.sendFollowupEmail(
      {
        name: lead.name,
        email: lead.email,
        businessType: lead.business_type,
        company: lead.company
      },
      sequence as 1 | 2 | 3,
      leadId
    )

    if (!emailResult.success) {
      return NextResponse.json(
        { error: 'Failed to send email', details: emailResult.error },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `Followup ${sequence} sent successfully`,
      messageId: emailResult.messageId
    })

  } catch (error) {
    console.error('Error in followup email API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET endpoint to check which emails have been sent for a lead
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const leadId = searchParams.get('leadId')

    if (!leadId) {
      return NextResponse.json(
        { error: 'leadId is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const { data: emails, error } = await supabase
      .from('email_logs')
      .select('template_name, status, sent_at, opened_at, clicked_at')
      .eq('lead_id', leadId)
      .order('sent_at', { ascending: true })

    if (error) {
      console.error('Error fetching email logs:', error)
      return NextResponse.json(
        { error: 'Failed to fetch email logs' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      leadId,
      emails: emails || []
    })

  } catch (error) {
    console.error('Error in email logs API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}