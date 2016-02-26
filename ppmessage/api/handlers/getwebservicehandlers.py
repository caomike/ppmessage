# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#

from .deviceuserloginhandler import DeviceUserLoginHandler
from .deviceuserlogouthandler import DeviceUserLogoutHandler
from .getyvobjectdetailhandler import GetYVObjectDetailHandler
from .ackmessagehandler import AckMessageHandler
from .sendmessagehandler import SendMessageHandler
from .forwardmessagehandler import ForwardMessageHandler
from .setdeviceinfohandler import SetDeviceInfoHandler

from .getrootorggrouplisthandler import GetRootOrgGroupListHandler
from .getsuborggrouplisthandler import GetSubOrgGroupListHandler
from .getparentsorggrouplisthandler import GetParentsOrgGroupListHandler
from .getgroupuserlisthandler import GetGroupUserListHandler

from .getleadinggrouplisthandler import GetLeadingGroupListHandler
from .getallappgrouplisthandler import GetAllAppGroupListHandler
from .getsubscribedappgrouplisthandler import GetSubscribedAppGroupListHandler

from .getunackedmessageshandler import GetUnackedMessagesHandler
from .getappgroupmenuhandler import GetAppGroupMenuHandler
from .getunackedmessagehandler import GetUnackedMessageHandler
from .subscribeappgrouphandler import SubscribeAppGroupHandler
from .unsubscribeappgrouphandler import UnSubscribeAppGroupHandler
from .getappversionhandler import GetAppVersionHandler

from .getmessagehistoryhandler import GetMessageHistoryHandler
from .createdgwithoghandler import CreateDGWithOGHandler
from .adddutodghandler import AddDUToDGHandler
from .inviteduascontacthandler import InviteDUAsContactHandler
from .acceptcontactinvitationhandler import AcceptContactInvitationHandler
from .getcontactlisthandler import GetContactListHandler
from .getdiscussiongrouplisthandler import GetDiscussionGroupListHandler
from .getslackaccesstokenhandler import GetSlackAccessTokenHandler
from .getintergrationtokenlisthandler import GetIntergrationTokenListHandler
from .unsetintergrationtokenhandler import UnsetIntergrationTokenHandler

from .searchuserlisthandler import SearchUserListHandler
from .removecontacthandler import RemoveContactHandler
from .createdgwithduhandler import CreateDGWithDUHandler
from .removecontacthandler import RemoveContactHandler

from .quitdghandler import QuitDGHandler
from .removedghandler import RemoveDGHandler

from .adddutoaghandler import AddDUToAGHandler
from .getactionmessagehandler import GetActionMessageHandler

from .fileisexistedhandler import FileIsExistedHandler
from .createfilerefhandler import CreateFilerefHandler

from .getsinglecardhandler import GetSingleCardHandler
from .getmultiplecardhandler import GetMultipleCardHandler

from .registerduhandler import RegisterDUHandler
from .registerdubymobilehandler import RegisterDUByMobileHandler
from .sendsmshandler import SendSMSHandler
from .requestjoinoghandler import RequestJoinOGHandler
from .approvejoinoghandler import ApproveJoinOGHandler
from .removeoguserhandler import RemoveOGUserHandler
from .setdiscussiongrouphandler import SetDiscussionGroupHandler

from .ppcreateanonymoushandler import PPCreateAnonymousHandler
from .ppcreateuserhandler import PPCreateUserHandler
from .ppremoveuserhandler import PPRemoveUserHandler
from .ppupdateuserhandler import PPUpdateUserHandler

from .ppcreatedevicehandler import PPCreateDeviceHandler
from .ppupdatedevicehandler import PPUpdateDeviceHandler

from .pponlinehandler import PPOnlineHandler
from .ppofflinehandler import PPOfflineHandler

from .ppcreateconversationhandler import PPCreateConversationHandler
from .ppupdateconversationhandler import PPUpdateConversationHandler
from .ppgetconversationinfohandler import PPGetConversationInfoHandler

from .ppgetappconversationlisthandler import PPGetAppConversationListHandler
from .ppgetuserconversationlisthandler import PPGetUserConversationListHandler

from .ppopenconversationhandler import PPOpenConversationHandler
from .ppcloseconversationhandler import PPCloseConversationHandler

from .ppgetappinfohandler import PPGetAppInfoHandler
from .ppgetappserviceuserlisthandler import PPGetAppServiceUserListHandler

from .ppsendmessagehandler import PPSendMessageHandler
from .ppgetuseruuidhandler import PPGetUserUUIDHandler
from .ppgethistorymessagehandler import PPGetHistoryMessageHandler
from .ppgetuserinfohandler import PPGetUserInfoHandler

from .ppgetapporggrouplisthandler import PPGetAppOrgGroupListHandler
from .ppgetorggroupdetailhandler import PPGetOrgGroupDetailHandler
from .ppgetorggroupuserlisthandler import PPGetOrgGroupUserListHandler
from .ppcreateorggrouphandler import PPCreateOrgGroupHandler
from .ppupdateorggrouphandler import PPUpdateOrgGroupHandler
from .ppremoveorggrouphandler import PPRemoveOrgGroupHandler
from .ppaddorggroupuserhandler import PPAddOrgGroupUserHandler
from .ppremoveorggroupuserhandler import PPRemoveOrgGroupUserHandler
from .ppgetnogroupuserlisthandler import PPGetNoGroupUserListHandler
from .ppgetorggroupconversationhandler import PPGetOrgGroupConversationHandler
from .ppupdateconversationmemberhandler import PPUpdateConversationMemberHandler

from .ppgetdefaultconversationhandler import PPGetDefaultConversationHandler
from .ppselectusersbygroupalgorithmhandler import PPSelectUsersByGroupAlgorithmHandler

from .ppupdateappinfohandler import PPUpdateAppInfoHandler
from .ppgetappownedbyuserhandler import PPGetAppOwnedByUserHandler
from .ppisemailvalidhandler import PPIsEmailValidHandler

from .ppcreateapphandler import PPCreateAppHandler
from .ppleaveapphandler import PPLeaveAppHandler
from .ppremoveapphandler import PPRemoveAppHandler

from .ppgetconversationuserlisthandler import PPGetConversationUserListHandler

from .pppageuserconversationhandler import PPPageUserConversationHandler
from .pppageunackedmessagehandler import PPPageUnackedMessageHandler
from .pppagehistorymessagehandler import PPPageHistoryMessageHandler

from .pppageonlineportaluserhandler import PPPageOnlinePortalUserHandler
from .pppagedevicenavigationhandler import PPPageDeviceNavigationHandler

from .ppkefuloginhandler import PPKefuLoginHandler
from .ppkefulogouthandler import PPKefuLogoutHandler

from .ppgetuserdetailhandler import PPGetUserDetailHandler
from .ppgetadmindetailhandler import PPGetAdminDetailHandler

from .ppconsolelogouthandler import PPConsoleLogoutHandler

from .ppconsolegetoverviewnumber import PPConsoleGetOverviewNumber
from .ppconsolegetrealtimecustomernumber import PPConsoleGetRealTimeCustomerNumber
from .ppconsolegetrealtimeservicenumber import PPConsoleGetRealTimeServiceNumber
from .ppconsolegetrealtimemessagenumber import PPConsoleGetRealTimeMessageNumber
from .ppconsolegetservicenumberbyrange import PPConsoleGetServiceNumberByRange
from .ppconsolegetcustomernumberbyrange import PPConsoleGetCustomerNumberByRange
from .ppconsolegetmessagenumberbyrange import PPConsoleGetMessageNumberByRange

def getWebServiceHandlers():
    handler_list = []

    # device user login
    handler_list.append((r"/DEVICE_USER_LOGIN", DeviceUserLoginHandler))

    # device user logout
    handler_list.append((r"/DEVICE_USER_LOGOUT", DeviceUserLogoutHandler))

    # get all root org groups
    handler_list.append((r"/GET_ROOT_ORGGROUP_LIST", GetRootOrgGroupListHandler))

    # get parents org group list for org group/device user
    handler_list.append((r"/GET_PARENTS_ORGGROUP_LIST", GetParentsOrgGroupListHandler))

    # get sub org group list for one org group
    handler_list.append((r"/GET_SUB_ORGGROUP_LIST", GetSubOrgGroupListHandler))

    # get user list in org group/app group
    handler_list.append((r"/GET_GROUPUSER_LIST", GetGroupUserListHandler))

    # current user is the org group leader for checking permission
    handler_list.append((r"/GET_LEADING_GROUP_LIST", GetLeadingGroupListHandler))

    # get all groups the current is following
    handler_list.append((r"/GET_SUBSCRIBED_APPGROUP_LIST", GetSubscribedAppGroupListHandler))

    # get all app groups
    handler_list.append((r"/GET_ALL_APPGROUP_LIST", GetAllAppGroupListHandler))

    # get app group menus
    handler_list.append((r"/GET_APPGROUP_MENU_LIST", GetAppGroupMenuHandler))

    # get yvobject detail yvobject is the caller and callee
    handler_list.append((r"/GET_YVOBJECT_DETAIL", GetYVObjectDetailHandler))

    # ack the received message
    handler_list.append((r"/ACK_MESSAGE", AckMessageHandler))

    # send message by MDM
    handler_list.append((r"/SEND_MESSAGE", SendMessageHandler))

    # forward message
    handler_list.append((r"/FORWARD_MESSAGE", ForwardMessageHandler))

    # set deviceinfo
    handler_list.append((r"/SET_DEVICE_INFO", SetDeviceInfoHandler))

    # get unacked messages
    handler_list.append((r"/GET_UNACKED_MESSAGES", GetUnackedMessagesHandler))

    # get unacked messages
    handler_list.append((r"/GET_UNACKED_MESSAGE", GetUnackedMessageHandler))

    # add app group data
    handler_list.append((r"/SUBSCRIBE_APPGROUP", SubscribeAppGroupHandler))

    # delete app group data
    handler_list.append((r"/UNSUBSCRIBE_APPGROUP", UnSubscribeAppGroupHandler))

    # get app version to check the lastest version for the app
    handler_list.append((r"/GET_APP_VERSION", GetAppVersionHandler))

    # get app version to check the lastest version for the app
    handler_list.append((r"/GET_MESSAGE_HISTORY", GetMessageHistoryHandler))

    # create DG with OG
    handler_list.append((r"/CREATE_DGWITHOG", CreateDGWithOGHandler))

    # invite DU to DG
    handler_list.append((r"/ADD_DUTODG", AddDUToDGHandler))

    # invite DU as Contact
    handler_list.append((r"/INVITE_DUASCONTACT", InviteDUAsContactHandler))

    # Remove Contact
    handler_list.append((r"/REMOVE_CONTACT", RemoveContactHandler))

    # accept contact invitation
    handler_list.append((r"/ACCEPT_CONTACT_INVITATION", AcceptContactInvitationHandler))

    # get contact list
    handler_list.append((r"/GET_CONTACT_LIST", GetContactListHandler))

    # get discussiongroup list
    handler_list.append((r"/GET_DISCUSSIONGROUP_LIST", GetDiscussionGroupListHandler))

    # intergration get token list
    handler_list.append((r"/GET_INTERGRATION_TOKEN_LIST", GetIntergrationTokenListHandler))

    # intergration unset token
    handler_list.append((r"/UNSET_INTERGRATION_TOKEN", UnsetIntergrationTokenHandler))

    # get slack's access token
    handler_list.append((r"/GET_SLACK_ACCESS_TOKEN", GetSlackAccessTokenHandler))

    # search user fullname by pattern
    handler_list.append((r"/SEARCH_USER_LIST", SearchUserListHandler))

    # create DG with DUs
    handler_list.append((r"/CREATE_DGWITHDU", CreateDGWithDUHandler))

    # quit DG
    handler_list.append((r"/QUIT_DG", QuitDGHandler))

    # delete DG
    handler_list.append((r"/REMOVE_DG", RemoveDGHandler))

    # add DU to App Group
    handler_list.append((r"/ADD_DUTOAG", AddDUToAGHandler))

    # get action message, when ag menu click
    handler_list.append((r"/GET_ACTION_MESSAGE", GetActionMessageHandler))

    # get single card message
    handler_list.append((r"/GET_SINGLE_CARD", GetSingleCardHandler))
    
    # get multiple card message
    handler_list.append((r"/GET_MULTIPLE_CARD", GetMultipleCardHandler))
    
    # check file is existed or not
    handler_list.append((r"/FILE_IS_EXISTED", FileIsExistedHandler))

    # create a file ref
    handler_list.append((r"/CREATE_FILEREF", CreateFilerefHandler))

    # register new user
    handler_list.append((r"/REGISTER_USER", RegisterDUHandler))

    # register new user by mobile
    handler_list.append((r"/REGISTER_USER_BY_MOBILE", RegisterDUByMobileHandler))    

    # request join org group
    handler_list.append((r"/REQUEST_JOIN_OG", RequestJoinOGHandler))

    # approve join org group
    handler_list.append((r"/APPROVE_JOIN_OG", ApproveJoinOGHandler))

    # remove og user
    handler_list.append((r"/REMOVE_OG_USER", RemoveOGUserHandler))

    # set discussion group name && icon && member
    handler_list.append((r"/SET_DISCUSSION_GROUP", SetDiscussionGroupHandler))

    # send sms
    handler_list.append((r"/SEND_SMS_VERFICATION_CODE", SendSMSHandler))

    # PPMESSAGE
    handler_list.append((r"/PP_CREATE_ANONYMOUS", PPCreateAnonymousHandler))
    handler_list.append((r"/PP_CREATE_USER", PPCreateUserHandler))
    handler_list.append((r"/PP_REMOVE_USER", PPRemoveUserHandler))
    handler_list.append((r"/PP_UPDATE_USER", PPUpdateUserHandler))
    
    handler_list.append((r"/PP_CREATE_DEVICE", PPCreateDeviceHandler))
    handler_list.append((r"/PP_UPDATE_DEVICE", PPUpdateDeviceHandler))
    
    handler_list.append((r"/PP_ONLINE", PPOnlineHandler))
    handler_list.append((r"/PP_OFFLINE", PPOfflineHandler))
    
    handler_list.append((r"/PP_CREATE_CONVERSATION", PPCreateConversationHandler))
    handler_list.append((r"/PP_UPDATE_CONVERSATION", PPUpdateConversationHandler))
    handler_list.append((r"/PP_GET_CONVERSATION_INFO", PPGetConversationInfoHandler))
    
    handler_list.append((r"/PP_GET_APP_CONVERSATION_LIST", PPGetAppConversationListHandler))
    handler_list.append((r"/PP_GET_USER_CONVERSATION_LIST", PPGetUserConversationListHandler))
    
    handler_list.append((r"/PP_OPEN_CONVERSATION", PPOpenConversationHandler))
    handler_list.append((r"/PP_CLOSE_CONVERSATION", PPCloseConversationHandler))

    handler_list.append((r"/PP_GET_APP_INFO", PPGetAppInfoHandler))
    handler_list.append((r"/PP_GET_APP_SERVICE_USER_LIST", PPGetAppServiceUserListHandler))

    handler_list.append((r"/PP_SEND_MESSAGE", PPSendMessageHandler))
    handler_list.append((r"/PP_GET_USER_UUID", PPGetUserUUIDHandler))
    handler_list.append((r"/PP_GET_HISTORY_MESSAGE", PPGetHistoryMessageHandler))
    handler_list.append((r"/PP_GET_USER_INFO", PPGetUserInfoHandler))

    handler_list.append((r"/PP_GET_APP_ORG_GROUP_LIST", PPGetAppOrgGroupListHandler))
    handler_list.append((r"/PP_GET_ORG_GROUP_DETAIL", PPGetOrgGroupDetailHandler))
    handler_list.append((r"/PP_GET_ORG_GROUP_USER_LIST", PPGetOrgGroupUserListHandler))
    handler_list.append((r"/PP_CREATE_ORG_GROUP", PPCreateOrgGroupHandler))
    handler_list.append((r"/PP_UPDATE_ORG_GROUP", PPUpdateOrgGroupHandler))
    handler_list.append((r"/PP_REMOVE_ORG_GROUP", PPRemoveOrgGroupHandler))
    handler_list.append((r"/PP_ADD_ORG_GROUP_USER", PPAddOrgGroupUserHandler))
    handler_list.append((r"/PP_REMOVE_ORG_GROUP_USER", PPRemoveOrgGroupUserHandler))
    handler_list.append((r"/PP_GET_NO_GROUP_USER_LIST", PPGetNoGroupUserListHandler)) 
    handler_list.append((r"/PP_GET_ORG_GROUP_CONVERSATION", PPGetOrgGroupConversationHandler))
    handler_list.append((r"/PP_UPDATE_CONVERSATION_MEMBER", PPUpdateConversationMemberHandler))

    handler_list.append((r"/PP_GET_DEFAULT_CONVERSATION", PPGetDefaultConversationHandler))
    handler_list.append((r"/PP_SELECT_USERS_BY_GROUP_ALGORITHM", PPSelectUsersByGroupAlgorithmHandler))

    handler_list.append((r"/PP_UPDATE_APP_INFO", PPUpdateAppInfoHandler))
    handler_list.append((r"/PP_GET_APP_OWNED_BY_USER", PPGetAppOwnedByUserHandler))
    handler_list.append((r"/PP_IS_EMAIL_VALID", PPIsEmailValidHandler))

    handler_list.append((r"/PP_CREATE_APP", PPCreateAppHandler))
    handler_list.append((r"/PP_LEAVE_APP", PPLeaveAppHandler))
    handler_list.append((r"/PP_REMOVE_APP", PPRemoveAppHandler))

    handler_list.append((r"/PP_GET_CONVERSATION_USER_LIST", PPGetConversationUserListHandler))
    
    handler_list.append((r"/PP_PAGE_USER_CONVERSATION", PPPageUserConversationHandler))
    handler_list.append((r"/PP_PAGE_UNACKED_MESSAGE", PPPageUnackedMessageHandler))
    handler_list.append((r"/PP_PAGE_HISTORY_MESSAGE", PPPageHistoryMessageHandler))

    handler_list.append((r"/PP_PAGE_ONLINE_PORTAL_USER", PPPageOnlinePortalUserHandler))
    handler_list.append((r"/PP_PAGE_DEVICE_NAVIGATION", PPPageDeviceNavigationHandler))

    handler_list.append((r"/PPKEFU_LOGIN", PPKefuLoginHandler))
    handler_list.append((r"/PPKEFU_LOGOUT", PPKefuLogoutHandler))

    handler_list.append((r"/PP_GET_USER_DETAIL", PPGetUserDetailHandler))
    handler_list.append((r"/PP_GET_ADMIN_DETAIL", PPGetAdminDetailHandler))

    handler_list.append((r"/PPCONSOLE_LOGOUT", PPConsoleLogoutHandler))

    handler_list.append((r"/PPCONSOLE_GET_OVERVIEW_NUMBER", PPConsoleGetOverviewNumber))
    handler_list.append((r"/PPCONSOLE_GET_REAL_TIME_CUSTOMER_NUMBER", PPConsoleGetRealTimeCustomerNumber))
    handler_list.append((r"/PPCONSOLE_GET_REAL_TIME_SERVICE_NUMBER", PPConsoleGetRealTimeServiceNumber))
    handler_list.append((r"/PPCONSOLE_GET_REAL_TIME_MESSAGE_NUMBER", PPConsoleGetRealTimeMessageNumber))
    handler_list.append((r"/PPCONSOLE_GET_SERVICE_NUMBER_BY_RANGE", PPConsoleGetServiceNumberByRange))
    handler_list.append((r"/PPCONSOLE_GET_CUSTOMER_NUMBER_BY_RANGE", PPConsoleGetCustomerNumberByRange))
    handler_list.append((r"/PPCONSOLE_GET_MESSAGE_NUMBER_BY_RANGE", PPConsoleGetMessageNumberByRange))

    return handler_list

