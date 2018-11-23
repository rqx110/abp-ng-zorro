import { ChatMessageDtoReadState, ChatMessageDtoSide, CreatePaymentDtoEditionPaymentType, CreatePaymentDtoPaymentPeriodType, CreatePaymentDtoSubscriptionPaymentGatewayType, DefaultTimezoneScope, FriendDtoState, IncomeStatisticsDateInterval, IsTenantAvailableOutputState, RegisterTenantInputSubscriptionStartType, SalesSummaryDatePeriod, UserNotificationState } from '@shared/service-proxies/service-proxies';

export class AppChatMessageReadState {
    static Unread: number = ChatMessageDtoReadState._1;
    static Read: number = ChatMessageDtoReadState._2;
}

export class AppChatSide {
    static Sender: number = ChatMessageDtoSide._1;
    static Receiver: number = ChatMessageDtoSide._2;
}

export class AppFriendshipState {
    static Accepted: number = FriendDtoState._1;
    static Blocked: number = FriendDtoState._2;
}


export class AppTimezoneScope {
    static Application: number = DefaultTimezoneScope._1;
    static Tenant: number = DefaultTimezoneScope._2;
    static User: number = DefaultTimezoneScope._4;
}

export class AppUserNotificationState {
    static Unread: number = UserNotificationState._0;
    static Read: number = UserNotificationState._1;
}

export class AppTenantAvailabilityState {
    static Available: number = IsTenantAvailableOutputState._1;
    static InActive: number = IsTenantAvailableOutputState._2;
    static NotFound: number = IsTenantAvailableOutputState._3;
}

export class AppIncomeStatisticsDateInterval {
    static Daily: number = IncomeStatisticsDateInterval._1;
    static Weekly: number = IncomeStatisticsDateInterval._2;
    static Monthly: number = IncomeStatisticsDateInterval._3;
}

export class SubscriptionStartType {

    static Free: number = RegisterTenantInputSubscriptionStartType._1;
    static Trial: number = RegisterTenantInputSubscriptionStartType._2;
    static Paid: number = RegisterTenantInputSubscriptionStartType._3;
}

export class EditionPaymentType {
    static NewRegistration: number = CreatePaymentDtoEditionPaymentType._0;
    static BuyNow: number = CreatePaymentDtoEditionPaymentType._1;
    static Upgrade: number = CreatePaymentDtoEditionPaymentType._2;
    static Extend: number = CreatePaymentDtoEditionPaymentType._3;
}

export class AppEditionExpireAction {
    static DeactiveTenant = 'DeactiveTenant';
    static AssignToAnotherEdition = 'AssignToAnotherEdition';
}

export class PaymentPeriodType  {
    static Monthly: number = CreatePaymentDtoPaymentPeriodType._30;
    static Annual: number = CreatePaymentDtoPaymentPeriodType._365;
}

export class SubscriptionPaymentGatewayType {
    static Paypal: number = CreatePaymentDtoSubscriptionPaymentGatewayType._1;
}

export class AppSalesSummaryDatePeriod {
    static Daily: number = SalesSummaryDatePeriod._1;
    static Weekly: number = SalesSummaryDatePeriod._2;
    static Monthly: number = SalesSummaryDatePeriod._3;
}
