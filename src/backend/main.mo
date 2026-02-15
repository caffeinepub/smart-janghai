import Map "mo:core/Map";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  type Time = Time.Time;
  type Principal = Principal.Principal;
  public type UserRole = AccessControl.UserRole;

  public type UserId = Principal;
  public type NewsId = Text;
  public type SchemeId = Text;
  public type JobId = Text;
  public type MediaId = Text;
  public type NotificationId = Nat;
  public type SettingsId = Text;
  public type ActivityLogId = Nat;

  public type User = {
    id : Principal;
    name : Text;
    mobile : Text;
    email : Text;
    role : UserRole;
    status : UserStatus;
    registrationDate : Time;
  };

  public type UserStatus = {
    #active;
    #inactive;
  };

  public type News = {
    id : NewsId;
    title : Text;
    description : Text;
    category : Text;
    tags : [Text];
    publishDate : Time;
    status : NewsStatus;
    scheduledPublishTime : ?Time;
    featuredImage : ?MediaId;
  };

  public type NewsStatus = {
    #draft;
    #published;
    #rejected;
  };

  public type Scheme = {
    id : SchemeId;
    name : Text;
    eligibilityDetails : Text;
    applyLink : Text;
    importantDates : Text;
    documents : [MediaId];
  };

  public type Job = {
    id : JobId;
    companyName : Text;
    salary : Nat;
    qualification : Text;
    applyLink : Text;
    expiryDate : Time;
    status : JobStatus;
  };

  public type JobStatus = {
    #active;
    #expired;
  };

  public type Media = {
    id : MediaId;
    filename : Text;
    contentType : Text;
    size : Nat;
    uploadTimestamp : Time;
    uploader : Principal;
    fileReference : Storage.ExternalBlob;
  };

  public type Notification = {
    id : NotificationId;
    message : Text;
    recipients : [Principal];
    timestamp : Time;
    delivered : Bool;
    read : Bool;
  };

  public type WebsiteSettings = {
    id : SettingsId;
    name : Text;
    logo : ?MediaId;
    tagline : Text;
    contactInfo : Text;
    socialLinks : [(Text, Text)];
    seoTitle : Text;
    seoDescription : Text;
  };

  public type ActivityLog = {
    id : ActivityLogId;
    action : Text;
    timestamp : Time;
    user : Principal;
  };

  let users = Map.empty<Principal, User>();
  let news = Map.empty<NewsId, News>();
  let schemes = Map.empty<SchemeId, Scheme>();
  let jobs = Map.empty<JobId, Job>();
  let media = Map.empty<MediaId, Media>();
  let notifications = Map.empty<NotificationId, Notification>();
  let websiteSettings = Map.empty<SettingsId, WebsiteSettings>();
  let activityLogs = Map.empty<ActivityLogId, ActivityLog>();

  var nextNotificationId = 1;
  var nextActivityLogId = 1;

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  type ActivityType = {
    #userCreated;
    #userUpdated;
    #newsCreated;
    #newsUpdated;
    #newsPublished;
    #newsDeleted;
    #schemeCreated;
    #schemeUpdated;
    #schemeDeleted;
    #jobCreated;
    #jobUpdated;
    #jobDeleted;
    #mediaUploaded;
    #mediaDeleted;
    #notificationCreated;
    #settingsUpdated;
    #backupExported;
    #csvExported;
    #roleChanged;
    #userStatusChanged;
    #login;
    #logout;
    // Add more activity types here as needed
  };

  public type AdminActivity = {
    time : Time.Time;
    principal : Principal.Principal;
    activityType : ActivityType;
    details : Text;
  };

  func generateId(prefix : Text, timestamp : Time) : Text {
    prefix # timestamp.toText();
  };

  public query ({ caller }) func getUser(id : Principal) : async ?User {
    if (caller != id and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can access other users");
    };
    users.get(id);
  };

  public shared ({ caller }) func createUser(name : Text, mobile : Text, email : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can create users.");
    };

    let user : User = {
      id = caller;
      name;
      mobile;
      email;
      role = #user;
      status = #active;
      registrationDate = Time.now();
    };
    users.add(caller, user);
  };

  public shared ({ caller }) func updateUser(id : Principal, name : Text, mobile : Text, email : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can update users.");
    };

    switch (users.get(id)) {
      case (null) { Runtime.trap("User not found") };
      case (?existingUser) {
        let updatedUser : User = { existingUser with name; mobile; email };
        users.add(id, updatedUser);
      };
    };
  };

  public shared ({ caller }) func setUserStatus(id : Principal, status : UserStatus) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only authorized users can change status");
    };

    switch (users.get(id)) {
      case (null) { Runtime.trap("User not found") };
      case (?existingUser) {
        let updatedUser : User = { existingUser with status };
        users.add(id, updatedUser);
      };
    };
  };

  public shared ({ caller }) func assignUserRole(id : Principal, role : AccessControl.UserRole) : async () {
    switch (users.get(id)) {
      case (null) {
        Runtime.trap("User not found");
      };
      case (?user) {
        if (not AccessControl.hasPermission(accessControlState, caller, role)) {
          Runtime.trap("Unauthorized: Only " # debugRole(role) # " can assign this role");
        };
        AccessControl.assignRole(accessControlState, caller, id, role);
        let updatedUser : User = { user with role };
        users.add(id, updatedUser);
      };
    };
  };

  func debugRole(role : AccessControl.UserRole) : Text {
    switch (role) {
      case (#admin) { "admin" };
      case (#user) { "user" };
      case (#guest) { "guest" };
    };
  };

  public query ({ caller }) func getAllUsers() : async [User] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view all users");
    };
    users.values().toArray();
  };

  public shared ({ caller }) func createNews(title : Text, description : Text, category : Text, tags : [Text], featuredImage : ?MediaId) : async NewsId {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admin and above can create news");
    };

    let id = generateId("news_", Time.now());

    let newsItem : News = {
      id;
      title;
      description;
      category;
      tags;
      publishDate = Time.now();
      status = #draft; // explicit tag
      scheduledPublishTime = null;
      featuredImage;
    };
    news.add(id, newsItem);
    id;
  };

  public shared ({ caller }) func updateNews(id : NewsId, title : Text, description : Text, category : Text, tags : [Text], featuredImage : ?MediaId) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admin and above can update news");
    };

    switch (news.get(id)) {
      case (null) { Runtime.trap("News not found") };
      case (?existingNews) {
        let updatedNews : News = { existingNews with title; description; category; tags; featuredImage };
        news.add(id, updatedNews);
      };
    };
  };

  public shared ({ caller }) func publishNews(id : NewsId) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admin and above can publish news");
    };

    switch (news.get(id)) {
      case (null) { Runtime.trap("News not found") };
      case (?existingNews) {
        let updatedNews : News = { existingNews with status = #published };
        news.add(id, updatedNews);
      };
    };
  };

  public shared ({ caller }) func deleteNewsItem(id : NewsId) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admin and above can delete news");
    };

    switch (news.get(id)) {
      case (null) { Runtime.trap("News not found") };
      case (?_) { news.remove(id) };
    };
  };

  public query ({ caller }) func getAllNews() : async [News] {
    news.values().toArray();
  };

  public query ({ caller }) func getAllPublishedNews() : async [News] {
    news.values().toArray().filter(func(newsItem) { newsItem.status == #published });
  };

  public query ({ caller }) func getPublishedNewsByCategory(category : Text) : async [News] {
    news.values().toArray().filter(func(n) { n.status == #published and n.category == category });
  };

  public shared ({ caller }) func createScheme(name : Text, eligibilityDetails : Text, applyLink : Text, importantDates : Text, documents : [MediaId]) : async SchemeId {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Admin and above required");
    };

    let id = generateId("scheme_", Time.now());

    let newScheme : Scheme = {
      id;
      name;
      eligibilityDetails;
      applyLink;
      importantDates;
      documents;
    };
    schemes.add(id, newScheme);
    id;
  };

  public shared ({ caller }) func updateScheme(id : SchemeId, name : Text, eligibilityDetails : Text, applyLink : Text, importantDates : Text, documents : [MediaId]) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Admin and above required");
    };

    switch (schemes.get(id)) {
      case (null) { Runtime.trap("Scheme not found") };
      case (?existingScheme) {
        let updatedScheme : Scheme = { existingScheme with name; eligibilityDetails; applyLink; importantDates; documents };
        schemes.add(id, updatedScheme);
      };
    };
  };

  public shared ({ caller }) func deleteScheme(id : SchemeId) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can delete schemes");
    };

    switch (schemes.get(id)) {
      case (null) { Runtime.trap("Scheme not found") };
      case (?_) { schemes.remove(id) };
    };
  };

  public query ({ caller }) func getScheme(id : SchemeId) : async ?Scheme {
    schemes.get(id);
  };

  public query ({ caller }) func getAllSchemes() : async [Scheme] {
    schemes.values().toArray();
  };

  public shared ({ caller }) func createJob(companyName : Text, salary : Nat, qualification : Text, applyLink : Text, expiryDate : Time) : async JobId {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Admin and above required");
    };

    let id = generateId("job_", Time.now());

    let newJob : Job = {
      id;
      companyName;
      salary;
      qualification;
      applyLink;
      expiryDate;
      status = #active;
    };
    jobs.add(id, newJob);
    id;
  };

  public shared ({ caller }) func updateJob(id : JobId, companyName : Text, salary : Nat, qualification : Text, applyLink : Text, expiryDate : Time) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Admin and above required");
    };

    switch (jobs.get(id)) {
      case (null) { Runtime.trap("Job not found") };
      case (?existingJob) {
        let updatedJob : Job = { existingJob with companyName; salary; qualification; applyLink; expiryDate };
        jobs.add(id, updatedJob);
      };
    };
  };

  public shared ({ caller }) func deleteJob(id : JobId) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can delete jobs");
    };

    switch (jobs.get(id)) {
      case (null) { Runtime.trap("Job not found") };
      case (?_) { jobs.remove(id) };
    };
  };

  public shared ({ caller }) func updateJobStatus(id : JobId, status : JobStatus) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Admin and above required");
    };

    switch (jobs.get(id)) {
      case (null) { Runtime.trap("Job not found") };
      case (?existingJob) {
        let updatedJob : Job = { existingJob with status };
        jobs.add(id, updatedJob);
      };
    };
  };

  public query ({ caller }) func getJob(id : JobId) : async ?Job {
    jobs.get(id);
  };

  public query ({ caller }) func getAllJobs() : async [Job] {
    jobs.values().toArray();
  };

  public query ({ caller }) func getActiveJobs() : async [Job] {
    jobs.values().toArray().filter(func(j) { j.status == #active });
  };

  public shared ({ caller }) func uploadMedia(filename : Text, contentType : Text, fileReference : Storage.ExternalBlob, size : Nat) : async MediaId {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Must be a user to upload media");
    };

    let id = generateId("media_", Time.now());

    let mediaItem : Media = {
      id;
      filename;
      contentType;
      fileReference;
      size;
      uploadTimestamp = Time.now();
      uploader = caller;
    };
    media.add(id, mediaItem);
    id;
  };

  public shared ({ caller }) func deleteMedia(id : MediaId) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Admin required");
    };

    switch (media.get(id)) {
      case (null) { Runtime.trap("Media not found") };
      case (?_) { media.remove(id) };
    };
  };

  public query ({ caller }) func getAllMedia() : async [Media] {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Admin required");
    };
    media.values().toArray();
  };

  public query ({ caller }) func searchMediaByType(contentType : Text) : async [Media] {
    media.values().toArray().filter(func(m) { m.contentType == contentType });
  };

  public shared ({ caller }) func createNotification(message : Text, recipients : [Principal], timestamp : Time) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Admin only");
    };

    let notification : Notification = {
      id = nextNotificationId;
      message;
      recipients;
      timestamp;
      delivered = false;
      read = false;
    };

    notifications.add(nextNotificationId, notification);
    nextNotificationId += 1;
  };

  public shared ({ caller }) func markNotificationRead(notifId : NotificationId) : async () {
    switch (notifications.get(notifId)) {
      case (null) { Runtime.trap("Notification not found") };
      case (?existingNotif) {
        let updatedNotification : Notification = { existingNotif with read = true };
        notifications.add(notifId, updatedNotification);
      };
    };
  };

  public query ({ caller }) func getNotificationsForUser(userId : UserId) : async [Notification] {
    notifications.values().toArray().filter(func(notif) {
      notif.recipients.findIndex(func(recipient) { recipient == userId }) != null;
    });
  };

  public shared ({ caller }) func updateWebsiteSettings(settings : WebsiteSettings) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admin only");
    };
    websiteSettings.add((settings.id), settings);
  };

  public query ({ caller }) func getWebsiteSettings(id : SettingsId) : async ?WebsiteSettings {
    websiteSettings.get(id);
  };

  public type ReportType = {
    #userGrowth;
    #newsViews;
    #mediaUploads;
    #jobApplications;
    #schemeApplications;
    #notificationDelivery;
    #systemHealth;
  };

  public shared ({ caller }) func exportBackup() : async {
    users : [(Principal, User)];
    news : [(Text, News)];
    schemes : [(Text, Scheme)];
    jobs : [(Text, Job)];
    media : [(Text, Media)];
    notifications : [(Nat, Notification)];
    websiteSettings : [(Text, WebsiteSettings)];
    activityLogs : [(Nat, ActivityLog)];
    nextNotificationId : Nat;
    nextActivityLogId : Nat;
  } {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admin only");
    };
    {
      users = users.toArray();
      news = news.toArray();
      schemes = schemes.toArray();
      jobs = jobs.toArray();
      media = media.toArray();
      notifications = notifications.toArray();
      websiteSettings = websiteSettings.toArray();
      activityLogs = activityLogs.toArray();
      nextNotificationId;
      nextActivityLogId;
    };
  };

  public shared ({ caller }) func recordActivity(activity : ActivityLog) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admin privilege required");
    };
    activityLogs.add(activity.id, activity);
    nextActivityLogId += 1;
  };

  let adminActivities = Map.empty<Nat, AdminActivity>();

  public shared ({ caller }) func recordAdminActivity(activityType : ActivityType, details : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can perform this action");
    };
    let now = Time.now();
    let activity : AdminActivity = {
      time = now;
      principal = caller;
      activityType;
      details;
    };
    let activityId = adminActivities.size();
    adminActivities.add(activityId, activity);
  };

  public query ({ caller }) func getAdminActivityLog() : async [AdminActivity] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can perform this action");
    };
    adminActivities.values().toArray();
  };

  public query ({ caller }) func getAllAdminActivities() : async [AdminActivity] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can perform this action");
    };
    adminActivities.values().toArray();
  };
};
