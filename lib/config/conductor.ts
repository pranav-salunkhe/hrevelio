import { orkesConductorClient } from "@io-orkes/conductor-javascript";

export const conductorClientPromise = orkesConductorClient({
    keyId: process.env.NEXT_PUBLIC_CONDUCTOR_ID,
    keySecret: process.env.NEXT_PUBLIC_CONDUCTOR_SECRET,
    serverUrl: "https://play.orkes.io/api",
})

