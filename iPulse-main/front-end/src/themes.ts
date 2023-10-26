export interface ITheme {
    background: string,

    primary: string,
    secondary: string,
    tertiary: string,

    mutedPrimary: string,
    mutedSecondary: string,
    mutedTertiary: string,
}

export const LightTheme: ITheme = {
    background: "#efefef",
    // background: "#ffffff",

    primary: "#ffffff",
    secondary: "#209ADF",
    tertiary: "#224957",

    mutedPrimary: "rgba(255,255,255, .8)",
    mutedSecondary: "rgba(32,154,223, .5)",
    mutedTertiary: "rgba(34,73,87, .8)",
}