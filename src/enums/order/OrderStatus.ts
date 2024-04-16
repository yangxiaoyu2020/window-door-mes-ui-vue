export enum OrderStatus {
    Creating = "CREATING",
    Submitted = "SUBMITTED",
    MeasurementVerification = "MEASUREMENT_VERIFICATION",
    Prepayment = "PREPAYMENT",
    TechnicalUnpacking = "TECHNICAL_UNPACKING",
    Cutting = "CUTTING",
    Scheduling = "SCHEDULING",
    PaymentOfBalance = "PAYMENT_OF_BALANCE",
    Logistics = "LOGISTICS",
    OrderCompletion = "ORDER_COMPLETION",
    
    CreationException = "CREATION_EXCEPTION",
    SubmittedException = "SUBMITTED_EXCEPTION",
    MeasurementVerificationException = "MEASUREMENT_VERIFICATION_EXCEPTION",
    PrepaymentException = "PREPAYMENT_EXCEPTION",
    TechnicalUnpackingException = "TECHNICAL_UNPACKING_EXCEPTION",
    CuttingException = "CUTTING_EXCEPTION",
    SchedulingException = "SCHEDULING_EXCEPTION",
    PaymentOfBalanceException = "PAYMENT_OF_BALANCE_EXCEPTION",
    LogisticsException = "LOGISTICS_EXCEPTION",
    OrderCompletionException = "ORDER_COMPLETION_EXCEPTION",
    OtherException = "OTHER_EXCEPTION",
    UnknownStatus = "UNKNOWN_STATUS",
  }

  export enum OrderSteps {
    Creating = "CREATING",
    Submitted = "SUBMITTED",
    MeasurementVerification = "MEASUREMENT_VERIFICATION",
    Prepayment = "PREPAYMENT",
    TechnicalUnpacking = "TECHNICAL_UNPACKING",
    Cutting = "CUTTING",
    Scheduling = "SCHEDULING",
    PaymentOfBalance = "PAYMENT_OF_BALANCE",
    Logistics = "LOGISTICS",
    OrderCompletion = "ORDER_COMPLETION"
  }