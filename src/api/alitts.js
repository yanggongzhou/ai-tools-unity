// 阿里 TTS
import { createAxios } from './api'

const baseUrl = "https://adserver.magics-ad.com"
const alitts = createAxios(baseUrl);

export const ALITTSAPI = {
    fetchToken: () => alitts.get(`/autoSay/client/get_tts_token`)
}
