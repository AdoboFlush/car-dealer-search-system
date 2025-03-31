export const ScraperStatus = {
    Completed: "completed",
    Pending: "pending",
    Processing: "processing",
    Failed: "failed",
    Canceled: "canceled"
};

export const ScraperStatusColor = {
    [ScraperStatus.Completed]: "primary",
    [ScraperStatus.Pending]: "secondary",
    [ScraperStatus.Processing]: "secondary",
    [ScraperStatus.Failed]: "destructive",
    [ScraperStatus.Canceled]: "destructive",
};

export const Dealer = {
    DashcarrPro: "dashcarr_pro",
    ManilaAutoDisplay: "manila_auto_display",
    CarEmpire: "car_empire"
};
