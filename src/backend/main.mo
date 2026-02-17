import Array "mo:core/Array";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Text "mo:core/Text";
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
  public type VotingResultId = Text;

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

  public type VotingResult = {
    id : VotingResultId;
    village : Text;
    candidate : Text;
    votes : Nat;
    lastUpdated : Time;
  };

  // Live Poll Types
  public type PollStatus = {
    #ongoing;
    #expired;
  };

  public type PollCandidate = {
    name : Text;
    votes : Nat;
  };

  public type LivePoll = {
    candidates : [PollCandidate];
    endTime : ?Time;
  };

  public type PollVote = {
    principal : Principal;
    candidateName : Text;
  };

  var decommissioned : Bool = false;

  let users = Map.empty<Principal, User>();
  let news = Map.empty<NewsId, News>();
  let schemes = Map.empty<SchemeId, Scheme>();
  let jobs = Map.empty<JobId, Job>();
  let media = Map.empty<MediaId, Media>();
  let notifications = Map.empty<NotificationId, Notification>();
  let websiteSettings = Map.empty<SettingsId, WebsiteSettings>();
  let activityLogs = Map.empty<ActivityLogId, ActivityLog>();
  let votingResults = Map.empty<VotingResultId, VotingResult>();

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
  };

  public type AdminActivity = {
    time : Time.Time;
    principal : Principal.Principal;
    activityType : ActivityType;
    details : Text;
  };

  // User Profile Management (required by frontend)
  public type UserProfile = {
    name : Text;
    mobile : Text;
    email : Text;
  };

  func checkDecommissioned() {
    if (decommissioned) {
      Runtime.trap("Service Unavailable: This website has been permanently decommissioned and is no longer available.");
    };
  };

  public shared ({ caller }) func decommissionWebsite() : async () {
    // Do NOT check decommissioned status here - this is the decommission operation itself
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can decommission the website");
    };

    decommissioned := true;
    users.clear();
    news.clear();
    schemes.clear();
    jobs.clear();
    media.clear();
    notifications.clear();
    websiteSettings.clear();
    activityLogs.clear();
    adminActivities.clear();
    votingResults.clear();
    nextNotificationId := 1;
    nextActivityLogId := 1;
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    checkDecommissioned();
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    switch (users.get(caller)) {
      case (null) { null };
      case (?user) {
        ?{
          name = user.name;
          mobile = user.mobile;
          email = user.email;
        };
      };
    };
  };

  public query ({ caller }) func getUserProfile(userId : Principal) : async ?UserProfile {
    checkDecommissioned();
    if (caller != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    switch (users.get(userId)) {
      case (null) { null };
      case (?user) {
        ?{
          name = user.name;
          mobile = user.mobile;
          email = user.email;
        };
      };
    };
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    checkDecommissioned();
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    switch (users.get(caller)) {
      case (null) {
        let user : User = {
          id = caller;
          name = profile.name;
          mobile = profile.mobile;
          email = profile.email;
          role = AccessControl.getUserRole(accessControlState, caller);
          status = #active;
          registrationDate = Time.now();
        };
        users.add(caller, user);
      };
      case (?existingUser) {
        let updatedUser : User = {
          existingUser with
          name = profile.name;
          mobile = profile.mobile;
          email = profile.email;
        };
        users.add(caller, updatedUser);
      };
    };
  };

  // User Management (Admin CRUD)
  public query ({ caller }) func getUser(id : Principal) : async ?User {
    checkDecommissioned();
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can access user details");
    };
    users.get(id);
  };

  public shared ({ caller }) func createUser(targetUserId : Principal, name : Text, mobile : Text, email : Text, role : UserRole) : async () {
    checkDecommissioned();
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can create users");
    };

    let user : User = {
      id = targetUserId;
      name;
      mobile;
      email;
      role;
      status = #active;
      registrationDate = Time.now();
    };
    users.add(targetUserId, user);
    AccessControl.assignRole(accessControlState, caller, targetUserId, role);
  };

  public shared ({ caller }) func updateUser(id : Principal, name : Text, mobile : Text, email : Text) : async () {
    checkDecommissioned();
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update users");
    };

    switch (users.get(id)) {
      case (null) { Runtime.trap("User not found") };
      case (?existingUser) {
        let updatedUser : User = { existingUser with name; mobile; email };
        users.add(id, updatedUser);
      };
    };
  };

  public shared ({ caller }) func deleteUser(id : Principal) : async () {
    checkDecommissioned();
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete users");
    };

    switch (users.get(id)) {
      case (null) { Runtime.trap("User not found") };
      case (?_) { users.remove(id) };
    };
  };

  public shared ({ caller }) func setUserStatus(id : Principal, status : UserStatus) : async () {
    checkDecommissioned();
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can change user status");
    };

    switch (users.get(id)) {
      case (null) { Runtime.trap("User not found") };
      case (?existingUser) {
        let updatedUser : User = { existingUser with status };
        users.add(id, updatedUser);
      };
    };
  };

  public shared ({ caller }) func assignUserRole(id : Principal, role : UserRole) : async () {
    checkDecommissioned();
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can assign roles");
    };

    switch (users.get(id)) {
      case (null) {
        Runtime.trap("User not found");
      };
      case (?user) {
        AccessControl.assignRole(accessControlState, caller, id, role);
        let updatedUser : User = { user with role };
        users.add(id, updatedUser);
      };
    };
  };

  public query ({ caller }) func getAllUsers() : async [User] {
    checkDecommissioned();
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view all users");
    };
    users.values().toArray();
  };

  // News Management (Admin CRUD)
  public shared ({ caller }) func createNews(title : Text, description : Text, category : Text, tags : [Text], featuredImage : ?MediaId) : async NewsId {
    checkDecommissioned();
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can create news");
    };

    let id = generateId("news_", Time.now());

    let newsItem : News = {
      id;
      title;
      description;
      category;
      tags;
      publishDate = Time.now();
      status = #draft;
      scheduledPublishTime = null;
      featuredImage;
    };
    news.add(id, newsItem);
    id;
  };

  public shared ({ caller }) func updateNews(id : NewsId, title : Text, description : Text, category : Text, tags : [Text], featuredImage : ?MediaId) : async () {
    checkDecommissioned();
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update news");
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
    checkDecommissioned();
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can publish news");
    };

    switch (news.get(id)) {
      case (null) { Runtime.trap("News not found") };
      case (?existingNews) {
        let updatedNews : News = { existingNews with status = #published; publishDate = Time.now() };
        news.add(id, updatedNews);
      };
    };
  };

  public shared ({ caller }) func deleteNewsItem(id : NewsId) : async () {
    checkDecommissioned();
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete news");
    };

    switch (news.get(id)) {
      case (null) { Runtime.trap("News not found") };
      case (?_) { news.remove(id) };
    };
  };

  public query ({ caller }) func getAllNews() : async [News] {
    checkDecommissioned();
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view all news");
    };
    news.values().toArray();
  };

  public query ({ caller }) func getAllPublishedNews() : async [News] {
    checkDecommissioned();
    news.values().toArray().filter(func(newsItem) { newsItem.status == #published });
  };

  public query ({ caller }) func getPublishedNewsByCategory(category : Text) : async [News] {
    checkDecommissioned();
    news.values().toArray().filter(func(n) { n.status == #published and n.category == category });
  };

  // Government Schemes Management (Admin CRUD)
  public shared ({ caller }) func createScheme(name : Text, eligibilityDetails : Text, applyLink : Text, importantDates : Text, documents : [MediaId]) : async SchemeId {
    checkDecommissioned();
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can create schemes");
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
    checkDecommissioned();
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update schemes");
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
    checkDecommissioned();
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete schemes");
    };

    switch (schemes.get(id)) {
      case (null) { Runtime.trap("Scheme not found") };
      case (?_) { schemes.remove(id) };
    };
  };

  public query ({ caller }) func getScheme(id : SchemeId) : async ?Scheme {
    checkDecommissioned();
    schemes.get(id);
  };

  public query ({ caller }) func getAllSchemes() : async [Scheme] {
    checkDecommissioned();
    schemes.values().toArray();
  };

  // Jobs Management (Admin CRUD with auto-expiry)
  public shared ({ caller }) func createJob(companyName : Text, salary : Nat, qualification : Text, applyLink : Text, expiryDate : Time) : async JobId {
    checkDecommissioned();
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can create jobs");
    };

    let id = generateId("job_", Time.now());
    let now = Time.now();
    let status = if (expiryDate <= now) { #expired } else { #active };

    let newJob : Job = {
      id;
      companyName;
      salary;
      qualification;
      applyLink;
      expiryDate;
      status;
    };
    jobs.add(id, newJob);
    id;
  };

  public shared ({ caller }) func updateJob(id : JobId, companyName : Text, salary : Nat, qualification : Text, applyLink : Text, expiryDate : Time) : async () {
    checkDecommissioned();
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update jobs");
    };

    switch (jobs.get(id)) {
      case (null) { Runtime.trap("Job not found") };
      case (?existingJob) {
        let now = Time.now();
        let status = if (expiryDate <= now) { #expired } else { #active };
        let updatedJob : Job = { existingJob with companyName; salary; qualification; applyLink; expiryDate; status };
        jobs.add(id, updatedJob);
      };
    };
  };

  public shared ({ caller }) func deleteJob(id : JobId) : async () {
    checkDecommissioned();
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete jobs");
    };

    switch (jobs.get(id)) {
      case (null) { Runtime.trap("Job not found") };
      case (?_) { jobs.remove(id) };
    };
  };

  public shared ({ caller }) func updateJobStatus(id : JobId, status : JobStatus) : async () {
    checkDecommissioned();
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update job status");
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
    checkDecommissioned();
    updateExpiredJobsInternal();
    jobs.get(id);
  };

  public query ({ caller }) func getAllJobs() : async [Job] {
    checkDecommissioned();
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view all jobs");
    };
    updateExpiredJobsInternal();
    jobs.values().toArray();
  };

  public query ({ caller }) func getActiveJobs() : async [Job] {
    checkDecommissioned();
    updateExpiredJobsInternal();
    jobs.values().toArray().filter(func(j) { j.status == #active });
  };

  func updateExpiredJobsInternal() {
    let now = Time.now();
    for ((id, job) in jobs.entries()) {
      if (job.status == #active and job.expiryDate <= now) {
        let expiredJob : Job = { job with status = #expired };
        jobs.add(id, expiredJob);
      };
    };
  };

  // Media Library Management (Admin CRUD)
  public shared ({ caller }) func uploadMedia(filename : Text, contentType : Text, fileReference : Storage.ExternalBlob, size : Nat) : async MediaId {
    checkDecommissioned();
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
    checkDecommissioned();
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete media");
    };

    switch (media.get(id)) {
      case (null) { Runtime.trap("Media not found") };
      case (?_) { media.remove(id) };
    };
  };

  public query ({ caller }) func getMedia(id : MediaId) : async ?Media {
    checkDecommissioned();
    media.get(id);
  };

  public query ({ caller }) func getAllMedia() : async [Media] {
    checkDecommissioned();
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view all media");
    };
    media.values().toArray();
  };

  public query ({ caller }) func searchMediaByType(contentType : Text) : async [Media] {
    checkDecommissioned();
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can search media");
    };
    media.values().toArray().filter(func(m) { m.contentType == contentType });
  };

  // Notifications Management
  public shared ({ caller }) func createNotification(message : Text, recipients : [Principal]) : async NotificationId {
    checkDecommissioned();
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can create notifications");
    };

    let notification : Notification = {
      id = nextNotificationId;
      message;
      recipients;
      timestamp = Time.now();
      delivered = true;
      read = false;
    };

    notifications.add(nextNotificationId, notification);
    let notifId = nextNotificationId;
    nextNotificationId += 1;
    notifId;
  };

  public shared ({ caller }) func markNotificationRead(notifId : NotificationId) : async () {
    checkDecommissioned();
    switch (notifications.get(notifId)) {
      case (null) { Runtime.trap("Notification not found") };
      case (?existingNotif) {
        let isRecipient = existingNotif.recipients.findIndex(func(recipient) { recipient == caller }) != null;
        if (not isRecipient and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only mark your own notifications as read");
        };
        let updatedNotification : Notification = { existingNotif with read = true };
        notifications.add(notifId, updatedNotification);
      };
    };
  };

  public query ({ caller }) func getNotificationsForUser(userId : UserId) : async [Notification] {
    checkDecommissioned();
    if (caller != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own notifications");
    };
    notifications.values().toArray().filter(func(notif) {
      notif.recipients.findIndex(func(recipient) { recipient == userId }) != null;
    });
  };

  public query ({ caller }) func getAllNotifications() : async [Notification] {
    checkDecommissioned();
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view all notifications");
    };
    notifications.values().toArray();
  };

  // Website Settings Management
  public shared ({ caller }) func updateWebsiteSettings(settings : WebsiteSettings) : async () {
    checkDecommissioned();
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update website settings");
    };
    websiteSettings.add((settings.id), settings);
  };

  public query ({ caller }) func getWebsiteSettings(id : SettingsId) : async ?WebsiteSettings {
    checkDecommissioned();
    websiteSettings.get(id);
  };

  // Voting Results (Admin CRUD)
  public shared ({ caller }) func createVotingResult(village : Text, candidate : Text, votes : Nat) : async VotingResultId {
    checkDecommissioned();
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can create voting results");
    };

    let now = Time.now();
    let id = generateId("vote_", now);

    let result : VotingResult = {
      id;
      village;
      candidate;
      votes;
      lastUpdated = now;
    };
    votingResults.add(id, result);
    id;
  };

  public shared ({ caller }) func updateVotingResult(id : VotingResultId, village : Text, candidate : Text, votes : Nat) : async () {
    checkDecommissioned();
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update voting results");
    };

    switch (votingResults.get(id)) {
      case (null) { Runtime.trap("Voting result not found") };
      case (?existingResult) {
        let updatedResult : VotingResult = { existingResult with village; candidate; votes; lastUpdated = Time.now() };
        votingResults.add(id, updatedResult);
      };
    };
  };

  public shared ({ caller }) func deleteVotingResult(id : VotingResultId) : async () {
    checkDecommissioned();
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete voting results");
    };

    switch (votingResults.get(id)) {
      case (null) { Runtime.trap("Voting result not found") };
      case (?_) { votingResults.remove(id) };
    };
  };

  public query ({ caller }) func getAllVotingResults() : async [VotingResult] {
    checkDecommissioned();
    votingResults.values().toArray();
  };

  // Live Poll (Voting Booth) Management
  var activePoll : ?LivePoll = null;
  var pollVotes = Map.empty<Principal, PollVote>();

  public shared ({ caller }) func createOrUpdatePoll(candidates : [Text], endTime : ?Time) : async () {
    checkDecommissioned();
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can create/update polls");
    };

    let pollCandidates = candidates.map(func(name) { { name; votes = 0 } });
    activePoll := ?{
      candidates = pollCandidates;
      endTime;
    };

    pollVotes.clear();
  };

  public query ({ caller }) func getPollStatus() : async {
    poll : ?LivePoll; status : PollStatus;
  } {
    checkDecommissioned();
    switch (activePoll) {
      case (null) { return { poll = null; status = #expired } };
      case (?poll) {
        let now = Time.now();
        let status = switch (poll.endTime) {
          case (null) { #ongoing };
          case (?end) {
            if (now < end) { #ongoing } else { #expired };
          };
        };
        { poll = activePoll; status };
      };
    };
  };

  public query ({ caller }) func getPollResults() : async {
    candidates : ?[PollCandidate]; status : PollStatus;
  } {
    checkDecommissioned();
    switch (activePoll) {
      case (null) { return { candidates = null; status = #expired } };
      case (?poll) {
        let now = Time.now();
        let status = switch (poll.endTime) {
          case (null) { #ongoing };
          case (?end) {
            if (now < end) { #ongoing } else { #expired };
          };
        };
        { candidates = ?poll.candidates; status };
      };
    };
  };

  public shared ({ caller }) func vote(candidateName : Text) : async Text {
    checkDecommissioned();

    // Enforce authentication: only authenticated users (not guests) can vote
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap(
        "Unauthorized: Only authenticated users can vote. Please log in with Internet Identity."
      );
    };

    switch (activePoll) {
      case (null) { return "Poll not available" };
      case (?poll) {
        let now = Time.now();
        let isExpired = switch (poll.endTime) {
          case (null) { false };
          case (?end) { now > end };
        };

        if (isExpired) { return "Poll has ended." };

        switch (pollVotes.get(caller)) {
          case (null) {
            switch (poll.candidates.find(
              func(c) { c.name == candidateName }
            )) {
              case (null) { return "Candidate " # candidateName # " not found" };
              case (?_) {
                let newCandidates = poll.candidates.map(
                  func(c) {
                    if (c.name == candidateName) { { c with votes = c.votes + 1 } } else { c };
                  }
                );
                let updatedPoll : LivePoll = {
                  poll with candidates = newCandidates;
                };
                let newVote : PollVote = {
                  principal = caller;
                  candidateName;
                };

                pollVotes.add(caller, newVote);
                activePoll := ?updatedPoll;
                return "Vote successful";
              };
            };
          };
          case (?vote) {
            return "You already voted for " # vote.candidateName;
          };
        };
      };
    };
  };

  public shared ({ caller }) func resetPoll() : async () {
    checkDecommissioned();
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can reset polls");
    };

    activePoll := null;
    pollVotes.clear();
  };

  // Dashboard Analytics and Metrics
  public type DashboardMetrics = {
    totalUsers : Nat;
    totalNews : Nat;
    totalJobs : Nat;
    totalSchemes : Nat;
    activeJobs : Nat;
    publishedNews : Nat;
    totalMedia : Nat;
    totalNotifications : Nat;
  };

  public type MonthlyGrowth = {
    month : Text;
    users : Nat;
    news : Nat;
    jobs : Nat;
  };

  public type RecentActivity = {
    timestamp : Time;
    activityType : ActivityType;
    details : Text;
    user : Principal;
  };

  public query ({ caller }) func getDashboardMetrics() : async DashboardMetrics {
    checkDecommissioned();
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view dashboard metrics");
    };

    updateExpiredJobsInternal();

    let activeJobsCount = jobs.values().toArray().filter(func(j) { j.status == #active }).size();
    let publishedNewsCount = news.values().toArray().filter(func(n) { n.status == #published }).size();

    {
      totalUsers = users.size();
      totalNews = news.size();
      totalJobs = jobs.size();
      totalSchemes = schemes.size();
      activeJobs = activeJobsCount;
      publishedNews = publishedNewsCount;
      totalMedia = media.size();
      totalNotifications = notifications.size();
    };
  };

  public query ({ caller }) func getRecentActivity(limit : Nat) : async [RecentActivity] {
    checkDecommissioned();
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view recent activity");
    };

    let activities = adminActivities.values().toArray();
    let sorted = activities.sort(
      func(a : AdminActivity, b : AdminActivity) : { #less; #equal; #greater } {
        if (a.time > b.time) { #less } else if (a.time < b.time) { #greater } else { #equal };
      },
    );

    let limitedActivities = if (sorted.size() > limit) {
      sorted.sliceToArray(0, limit);
    } else {
      sorted;
    };

    limitedActivities.map(
      func(a : AdminActivity) : RecentActivity {
        {
          timestamp = a.time;
          activityType = a.activityType;
          details = a.details;
          user = a.principal;
        };
      }
    );
  };

  public query ({ caller }) func getMonthlyGrowth(months : Nat) : async [MonthlyGrowth] {
    checkDecommissioned();
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view growth metrics");
    };

    // Simplified implementation - returns placeholder data
    // In production, this would aggregate data by month from timestamps
    let result : [MonthlyGrowth] = [];
    result;
  };

  // Backup and Export
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
    votingResults : [(Text, VotingResult)];
    nextNotificationId : Nat;
    nextActivityLogId : Nat;
    activePoll : ?LivePoll;
    pollVotes : [(Principal, PollVote)];
  } {
    checkDecommissioned();
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can export backups");
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
      votingResults = votingResults.toArray();
      nextNotificationId;
      nextActivityLogId;
      activePoll;
      pollVotes = pollVotes.toArray();
    };
  };

  // Activity Logging
  public shared ({ caller }) func recordActivity(activity : ActivityLog) : async () {
    checkDecommissioned();
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can record activity");
    };
    activityLogs.add(activity.id, activity);
    nextActivityLogId += 1;
  };

  let adminActivities = Map.empty<Nat, AdminActivity>();

  public shared ({ caller }) func recordAdminActivity(activityType : ActivityType, details : Text) : async () {
    checkDecommissioned();
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can record admin activity");
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
    checkDecommissioned();
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view activity log");
    };
    adminActivities.values().toArray();
  };

  public query ({ caller }) func getAllAdminActivities() : async [AdminActivity] {
    checkDecommissioned();
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view all activities");
    };
    adminActivities.values().toArray();
  };

  func generateId(prefix : Text, timestamp : Time) : Text {
    prefix # timestamp.toText();
  };
};
