import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Storage "blob-storage/Storage";

module {
  type Time = Time.Time;
  type Principal = Principal.Principal;
  type UserRole = { #admin; #user; #guest };

  type User = {
    id : Principal;
    name : Text;
    mobile : Text;
    email : Text;
    role : UserRole;
    status : UserStatus;
    registrationDate : Time;
  };

  type UserStatus = {
    #active;
    #inactive;
  };

  type News = {
    id : Text;
    title : Text;
    description : Text;
    category : Text;
    tags : [Text];
    publishDate : Time;
    status : NewsStatus;
    scheduledPublishTime : ?Time;
    featuredImage : ?Text;
  };

  type NewsStatus = {
    #draft;
    #published;
    #rejected;
  };

  type Scheme = {
    id : Text;
    name : Text;
    eligibilityDetails : Text;
    applyLink : Text;
    importantDates : Text;
    documents : [Text];
  };

  type Job = {
    id : Text;
    companyName : Text;
    salary : Nat;
    qualification : Text;
    applyLink : Text;
    expiryDate : Time;
    status : JobStatus;
  };

  type JobStatus = {
    #active;
    #expired;
  };

  type Media = {
    id : Text;
    filename : Text;
    contentType : Text;
    size : Nat;
    uploadTimestamp : Time;
    uploader : Principal;
    fileReference : Storage.ExternalBlob;
  };

  type Notification = {
    id : Nat;
    message : Text;
    recipients : [Principal];
    timestamp : Time;
    delivered : Bool;
    read : Bool;
  };

  type WebsiteSettings = {
    id : Text;
    name : Text;
    logo : ?Text;
    tagline : Text;
    contactInfo : Text;
    socialLinks : [(Text, Text)];
    seoTitle : Text;
    seoDescription : Text;
  };

  type ActivityLog = {
    id : Nat;
    action : Text;
    timestamp : Time;
    user : Principal;
  };

  type VotingResult = {
    id : Text;
    village : Text;
    candidate : Text;
    votes : Nat;
    lastUpdated : Time;
  };

  type OldActor = {
    users : Map.Map<Principal, User>;
    news : Map.Map<Text, News>;
    schemes : Map.Map<Text, Scheme>;
    jobs : Map.Map<Text, Job>;
    media : Map.Map<Text, Media>;
    notifications : Map.Map<Nat, Notification>;
    websiteSettings : Map.Map<Text, WebsiteSettings>;
    activityLogs : Map.Map<Nat, ActivityLog>;
    nextNotificationId : Nat;
    nextActivityLogId : Nat;
  };

  type NewActor = {
    users : Map.Map<Principal, User>;
    news : Map.Map<Text, News>;
    schemes : Map.Map<Text, Scheme>;
    jobs : Map.Map<Text, Job>;
    media : Map.Map<Text, Media>;
    notifications : Map.Map<Nat, Notification>;
    websiteSettings : Map.Map<Text, WebsiteSettings>;
    activityLogs : Map.Map<Nat, ActivityLog>;
    votingResults : Map.Map<Text, VotingResult>;
    nextNotificationId : Nat;
    nextActivityLogId : Nat;
  };

  public func run(old : OldActor) : NewActor {
    { old with votingResults = Map.empty<Text, VotingResult>() };
  };
};
