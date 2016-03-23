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
from .forwardmessagehandler import ForwardMessageHandler
from .setdeviceinfohandler import SetDeviceInfoHandler

from .getunackedmessageshandler import GetUnackedMessagesHandler
from .getunackedmessagehandler import GetUnackedMessageHandler
from .getappversionhandler import GetAppVersionHandler

from .getmessagehistoryhandler import GetMessageHistoryHandler

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
from .ppconsolesignuphandler import PPConsoleSignupHandler

from .ppconsolegetoverviewnumber import PPConsoleGetOverviewNumber
from .ppconsolegetrealtimecustomernumber import PPConsoleGetRealTimeCustomerNumber
from .ppconsolegetrealtimeservicenumber import PPConsoleGetRealTimeServiceNumber
from .ppconsolegetrealtimemessagenumber import PPConsoleGetRealTimeMessageNumber
from .ppconsolegetservicenumberbyrange import PPConsoleGetServiceNumberByRange
from .ppconsolegetcustomernumberbyrange import PPConsoleGetCustomerNumberByRange
from .ppconsolegetmessagenumberbyrange import PPConsoleGetMessageNumberByRange

from .ppgetapiinfohandler import PPGetApiInfoHandler

from .ppgetallapplisthandler import PPGetAllAppListHandler

def getWebServiceHandlers():
    handler_list = []

    # device user login
    handler_list.append((r"/DEVICE_USER_LOGIN", DeviceUserLoginHandler))

    # device user logout
    handler_list.append((r"/DEVICE_USER_LOGOUT", DeviceUserLogoutHandler))

    # get yvobject detail yvobject is the caller and callee
    handler_list.append((r"/GET_YVOBJECT_DETAIL", GetYVObjectDetailHandler))

    # ack the received message
    handler_list.append((r"/ACK_MESSAGE", AckMessageHandler))

    # forward message
    handler_list.append((r"/FORWARD_MESSAGE", ForwardMessageHandler))

    # set deviceinfo
    handler_list.append((r"/SET_DEVICE_INFO", SetDeviceInfoHandler))

    # get unacked messages
    handler_list.append((r"/GET_UNACKED_MESSAGES", GetUnackedMessagesHandler))

    # get unacked messages
    handler_list.append((r"/GET_UNACKED_MESSAGE", GetUnackedMessageHandler))

    # get app version to check the lastest version for the app
    handler_list.append((r"/GET_APP_VERSION", GetAppVersionHandler))

    # get app version to check the lastest version for the app
    handler_list.append((r"/GET_MESSAGE_HISTORY", GetMessageHistoryHandler))

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
    handler_list.append((r"/PPCONSOLE_SIGNUP", PPConsoleSignupHandler))

    handler_list.append((r"/PPCONSOLE_GET_OVERVIEW_NUMBER", PPConsoleGetOverviewNumber))
    handler_list.append((r"/PPCONSOLE_GET_REAL_TIME_CUSTOMER_NUMBER", PPConsoleGetRealTimeCustomerNumber))
    handler_list.append((r"/PPCONSOLE_GET_REAL_TIME_SERVICE_NUMBER", PPConsoleGetRealTimeServiceNumber))
    handler_list.append((r"/PPCONSOLE_GET_REAL_TIME_MESSAGE_NUMBER", PPConsoleGetRealTimeMessageNumber))
    handler_list.append((r"/PPCONSOLE_GET_SERVICE_NUMBER_BY_RANGE", PPConsoleGetServiceNumberByRange))
    handler_list.append((r"/PPCONSOLE_GET_CUSTOMER_NUMBER_BY_RANGE", PPConsoleGetCustomerNumberByRange))
    handler_list.append((r"/PPCONSOLE_GET_MESSAGE_NUMBER_BY_RANGE", PPConsoleGetMessageNumberByRange))

    handler_list.append((r"/PP_GET_API_INFO", PPGetApiInfoHandler))

    handler_list.append((r"/PP_GET_ALL_APP_LIST", PPGetAllAppListHandler))
    
    return handler_list

