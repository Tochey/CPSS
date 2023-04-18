export interface CanvasUserObject {
    id: number
    name: string
    short_name: string
    sortable_name: string
    title: string | null
    bio: string | null
    primary_email: string
    login_id: string
    integration_id: string | null
    time_zone: string
    locale: string | null
    effective_locale: "en"
    calendar: {
        lti_user_id: string
        ics: string
    }
    k5_user: boolean
}

export interface CanvasCourse {
    id: number
    name: string
    account_id: number
    uuid: string
    start_at: string
    grading_standard_id: number
    is_public: boolean
    created_at: string
    course_code: string
    default_view: string
    root_account_id: number
    enrollment_term_id: number
    license: string
    grade_passback_setting: string | null
    end_at: string
    public_syllabus: boolean
    public_syllabus_to_auth: boolean
    storage_quota_mb: number
    is_public_to_auth_users: boolean
    homeroom_course: boolean
    course_color: string
    friendly_name: string | null
    apply_assignment_group_weights: boolean
    calendar: {
        ics: string
    }
    time_zone: string
    blueprint: boolean
    template: boolean
    enrollments: [[Object]]
    hide_final_grades: boolean
    workflow_state: string
    restrict_enrollments_to_course_dates: boolean
}

export interface CanvasAssignment {
    id: number
    description: null | string
    due_at: null | string
    unlock_at: null | string
    lock_at: null | string
    points_possible: number
    grading_type: string
    assignment_group_id: number
    grading_standard_id: null | number
    created_at: string
    updated_at: string
    peer_reviews: boolean
    automatic_peer_reviews: boolean
    position: number
    grade_group_students_individually: boolean
    anonymous_peer_reviews: boolean
    group_category_id: null | number
    post_to_sis: boolean
    moderated_grading: boolean
    omit_from_final_grade: boolean
    intra_group_peer_reviews: boolean
    anonymous_instructor_annotations: boolean
    anonymous_grading: boolean
    graders_anonymous_to_graders: boolean
    grader_count: number
    grader_comments_visible_to_graders: boolean
    final_grader_id: null | number
    grader_names_visible_to_final_grader: boolean
    allowed_attempts: number
    annotatable_attachment_id: null | number
    secure_params: string
    lti_context_id: string
    course_id: number
    name: string
    submission_types: string[]
    has_submitted_submissions: boolean
    due_date_required: boolean
    max_name_length: number
    in_closed_grading_period: boolean
    graded_submissions_exist: boolean
    turnitin_enabled: boolean
    turnitin_settings: {
        originality_report_visibility: string
        s_paper_check: boolean
        internet_check: boolean
        journal_check: boolean
        exclude_biblio: boolean
        exclude_quoted: boolean
        exclude_small_matches_type: null | string
        exclude_small_matches_value: null | string
        submit_papers_to: boolean
    }
    is_quiz_assignment: boolean
    can_duplicate: boolean
    original_course_id: null | number
    original_assignment_id: null | number
    original_lti_resource_link_id: null | string
    original_assignment_name: null | string
    original_quiz_id: null | number
    workflow_state: string
    important_dates: boolean
    external_tool_tag_attributes: {
        url: string
        new_tab: boolean
        resource_link_id: string
        external_data: null
        content_type: string
        content_id: number
        custom_params: null
    }
    muted: boolean
    html_url: string
    url: string
    published: boolean
    only_visible_to_overrides: boolean
    submission: {
        id: number
        body: null | string
        url: string
        grade: string
        score: number
        submitted_at: string
        assignment_id: number
        user_id: number
        submission_type: string
        workflow_state: string
        grade_matches_current_submission: boolean
        graded_at: string
        grader_id: number
        attempt: number
        cached_due_date: null
        excused: boolean
        late_policy_status: null
        points_deducted: null
        grading_period_id: null
        extra: unknown
    }
}

export interface CanvasSubmission {
    id: number
    body: null
    url: null
    grade: string
    score: number
    submitted_at: string
    assignment_id: number
    user_id: number
    submission_type: string
    workflow_state: string
    grade_matches_current_submission: boolean
    graded_at: string
    grader_id: number
    attempt: number
    cached_due_date: string
    excused: boolean
    late_policy_status: null
    points_deducted: number
    grading_period_id: null
    extra_attempts: null
    posted_at: string
    redo_request: boolean
    late: boolean
    missing: boolean
    seconds_late: number
    entered_grade: string
    entered_score: number
    preview_url: string
    attachments: Array<{
        id: number
        uuid: string
        folder_id: number
        display_name: string
        filename: string
        upload_status: string
        "content-type": string
        url: string
        size: number
        created_at: string
        updated_at: string
        unlock_at: null
        locked: boolean
        hidden: boolean
        lock_at: null
        hidden_for_user: boolean
        thumbnail_url: null
        modified_at: string
        mime_class: string
        media_entry_id: null
        category: string
        locked_for_user: boolean
        preview_url: string
    }>
}
