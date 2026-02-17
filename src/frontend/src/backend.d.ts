import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export type SettingsId = string;
export type Time = bigint;
export interface PollCandidate {
    votes: bigint;
    name: string;
}
export interface AdminActivity {
    principal: Principal;
    activityType: ActivityType;
    time: Time;
    details: string;
}
export interface RecentActivity {
    activityType: ActivityType;
    user: Principal;
    timestamp: Time;
    details: string;
}
export interface VotingResult {
    id: VotingResultId;
    votes: bigint;
    lastUpdated: Time;
    village: string;
    candidate: string;
}
export interface Job {
    id: JobId;
    status: JobStatus;
    salary: bigint;
    applyLink: string;
    expiryDate: Time;
    companyName: string;
    qualification: string;
}
export type VotingResultId = string;
export type SchemeId = string;
export interface PollVote {
    principal: Principal;
    candidateName: string;
}
export interface Media {
    id: MediaId;
    contentType: string;
    size: bigint;
    uploadTimestamp: Time;
    filename: string;
    uploader: Principal;
    fileReference: ExternalBlob;
}
export interface WebsiteSettings {
    id: SettingsId;
    contactInfo: string;
    seoTitle: string;
    tagline: string;
    socialLinks: Array<[string, string]>;
    logo?: MediaId;
    name: string;
    seoDescription: string;
}
export type NewsId = string;
export interface User {
    id: Principal;
    status: UserStatus;
    name: string;
    role: UserRole;
    email: string;
    mobile: string;
    registrationDate: Time;
}
export interface ActivityLog {
    id: ActivityLogId;
    action: string;
    user: Principal;
    timestamp: Time;
}
export type Principal = Principal;
export interface MonthlyGrowth {
    month: string;
    jobs: bigint;
    news: bigint;
    users: bigint;
}
export interface Scheme {
    id: SchemeId;
    documents: Array<MediaId>;
    applyLink: string;
    name: string;
    importantDates: string;
    eligibilityDetails: string;
}
export type JobId = string;
export type UserId = Principal;
export interface LivePoll {
    endTime?: Time;
    candidates: Array<PollCandidate>;
}
export type ActivityLogId = bigint;
export type NotificationId = bigint;
export interface Notification {
    id: NotificationId;
    read: boolean;
    recipients: Array<Principal>;
    message: string;
    timestamp: Time;
    delivered: boolean;
}
export interface News {
    id: NewsId;
    status: NewsStatus;
    title: string;
    publishDate: Time;
    featuredImage?: MediaId;
    tags: Array<string>;
    description: string;
    scheduledPublishTime?: Time;
    category: string;
}
export interface DashboardMetrics {
    totalMedia: bigint;
    totalSchemes: bigint;
    publishedNews: bigint;
    totalJobs: bigint;
    totalNews: bigint;
    totalNotifications: bigint;
    totalUsers: bigint;
    activeJobs: bigint;
}
export type MediaId = string;
export interface UserProfile {
    name: string;
    email: string;
    mobile: string;
}
export enum ActivityType {
    mediaDeleted = "mediaDeleted",
    newsPublished = "newsPublished",
    schemeCreated = "schemeCreated",
    schemeDeleted = "schemeDeleted",
    mediaUploaded = "mediaUploaded",
    backupExported = "backupExported",
    csvExported = "csvExported",
    logout = "logout",
    userUpdated = "userUpdated",
    jobUpdated = "jobUpdated",
    newsUpdated = "newsUpdated",
    notificationCreated = "notificationCreated",
    login = "login",
    settingsUpdated = "settingsUpdated",
    schemeUpdated = "schemeUpdated",
    userCreated = "userCreated",
    jobCreated = "jobCreated",
    jobDeleted = "jobDeleted",
    newsCreated = "newsCreated",
    newsDeleted = "newsDeleted",
    userStatusChanged = "userStatusChanged",
    roleChanged = "roleChanged"
}
export enum JobStatus {
    active = "active",
    expired = "expired"
}
export enum NewsStatus {
    published = "published",
    rejected = "rejected",
    draft = "draft"
}
export enum PollStatus {
    expired = "expired",
    ongoing = "ongoing"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum UserStatus {
    active = "active",
    inactive = "inactive"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    assignUserRole(id: Principal, role: UserRole): Promise<void>;
    createJob(companyName: string, salary: bigint, qualification: string, applyLink: string, expiryDate: Time): Promise<JobId>;
    createNews(title: string, description: string, category: string, tags: Array<string>, featuredImage: MediaId | null): Promise<NewsId>;
    createNotification(message: string, recipients: Array<Principal>): Promise<NotificationId>;
    createOrUpdatePoll(candidates: Array<string>, endTime: Time | null): Promise<void>;
    createScheme(name: string, eligibilityDetails: string, applyLink: string, importantDates: string, documents: Array<MediaId>): Promise<SchemeId>;
    createUser(targetUserId: Principal, name: string, mobile: string, email: string, role: UserRole): Promise<void>;
    createVotingResult(village: string, candidate: string, votes: bigint): Promise<VotingResultId>;
    decommissionWebsite(): Promise<void>;
    deleteJob(id: JobId): Promise<void>;
    deleteMedia(id: MediaId): Promise<void>;
    deleteNewsItem(id: NewsId): Promise<void>;
    deleteScheme(id: SchemeId): Promise<void>;
    deleteUser(id: Principal): Promise<void>;
    deleteVotingResult(id: VotingResultId): Promise<void>;
    exportBackup(): Promise<{
        media: Array<[string, Media]>;
        activityLogs: Array<[bigint, ActivityLog]>;
        notifications: Array<[bigint, Notification]>;
        nextActivityLogId: bigint;
        jobs: Array<[string, Job]>;
        news: Array<[string, News]>;
        schemes: Array<[string, Scheme]>;
        pollVotes: Array<[Principal, PollVote]>;
        users: Array<[Principal, User]>;
        nextNotificationId: bigint;
        votingResults: Array<[string, VotingResult]>;
        websiteSettings: Array<[string, WebsiteSettings]>;
        activePoll?: LivePoll;
    }>;
    getActiveJobs(): Promise<Array<Job>>;
    getAdminActivityLog(): Promise<Array<AdminActivity>>;
    getAllAdminActivities(): Promise<Array<AdminActivity>>;
    getAllJobs(): Promise<Array<Job>>;
    getAllMedia(): Promise<Array<Media>>;
    getAllNews(): Promise<Array<News>>;
    getAllNotifications(): Promise<Array<Notification>>;
    getAllPublishedNews(): Promise<Array<News>>;
    getAllSchemes(): Promise<Array<Scheme>>;
    getAllUsers(): Promise<Array<User>>;
    getAllVotingResults(): Promise<Array<VotingResult>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDashboardMetrics(): Promise<DashboardMetrics>;
    getJob(id: JobId): Promise<Job | null>;
    getMedia(id: MediaId): Promise<Media | null>;
    getMonthlyGrowth(months: bigint): Promise<Array<MonthlyGrowth>>;
    getNotificationsForUser(userId: UserId): Promise<Array<Notification>>;
    getPollResults(): Promise<{
        status: PollStatus;
        candidates?: Array<PollCandidate>;
    }>;
    getPollStatus(): Promise<{
        status: PollStatus;
        poll?: LivePoll;
    }>;
    getPublishedNewsByCategory(category: string): Promise<Array<News>>;
    getRecentActivity(limit: bigint): Promise<Array<RecentActivity>>;
    getScheme(id: SchemeId): Promise<Scheme | null>;
    getUser(id: Principal): Promise<User | null>;
    getUserProfile(userId: Principal): Promise<UserProfile | null>;
    getWebsiteSettings(id: SettingsId): Promise<WebsiteSettings | null>;
    isCallerAdmin(): Promise<boolean>;
    markNotificationRead(notifId: NotificationId): Promise<void>;
    publishNews(id: NewsId): Promise<void>;
    recordActivity(activity: ActivityLog): Promise<void>;
    recordAdminActivity(activityType: ActivityType, details: string): Promise<void>;
    resetPoll(): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchMediaByType(contentType: string): Promise<Array<Media>>;
    setUserStatus(id: Principal, status: UserStatus): Promise<void>;
    updateJob(id: JobId, companyName: string, salary: bigint, qualification: string, applyLink: string, expiryDate: Time): Promise<void>;
    updateJobStatus(id: JobId, status: JobStatus): Promise<void>;
    updateNews(id: NewsId, title: string, description: string, category: string, tags: Array<string>, featuredImage: MediaId | null): Promise<void>;
    updateScheme(id: SchemeId, name: string, eligibilityDetails: string, applyLink: string, importantDates: string, documents: Array<MediaId>): Promise<void>;
    updateUser(id: Principal, name: string, mobile: string, email: string): Promise<void>;
    updateVotingResult(id: VotingResultId, village: string, candidate: string, votes: bigint): Promise<void>;
    updateWebsiteSettings(settings: WebsiteSettings): Promise<void>;
    uploadMedia(filename: string, contentType: string, fileReference: ExternalBlob, size: bigint): Promise<MediaId>;
    vote(candidateName: string): Promise<string>;
}
