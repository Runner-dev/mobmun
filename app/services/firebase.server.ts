import type { ServiceAccount } from "firebase-admin";
import firebaseAdmin from "firebase-admin";

const serviceAccount: ServiceAccount = {
  projectId: "mobmun-986a2",
  privateKey:
    "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDXpRBzYa/iEFIE\nZhXKLjMeRaJ3LFA0OrbpoNQD6+b43KYqO/L618xNzW9+lm28VjStDyLUVBpepGDa\nJz2HXS5bc1Y99qyTpC43ol8cyNgr/UPuAgxNFC2MwjqSDcOQmA8k5MNcIx+Z05q+\nBnuclijzAl1WPsUzUwpC08b4tZnS865H+p/hpbS2RSbXnC6mPCfjwmNulgEOWEJF\nl8/4RTPAWiV2kxJ+knzWE/P/Fmvrh7aloMG1WMnwHrYTES6IU5TrkT1SNlkD6kU8\n5e76Khi5i5FK9LYYH6S5RU4r/NW2oAHzSaSiJflERF0tXPUBXF/13IKz+hpvrF0o\nnZrDIlD9AgMBAAECggEABDS7vKhh3BSp6NyN3b7nb9Z3XAAxA0fG5AknQXlTLLTv\nB8FaFKLrYPQaEdvAwazjw6FZMk9+oSxvGCouRMrgOdfmzXgXdxy7awnfdYoET11V\n+xkuoL09QzLRniInF5Wjq/pLRiuINQGf0ceCFzSFkXHRHLrGMWFUAKgtSBIQsUDW\nzMoMlFvrMg5mQHh3zzMFygYOjX6J6Q7CJqfVfZfAy3QHYvwxco2Vv94acIquH/c5\ne4dWWfJJS3vhkV4hCBFLF4Qi01NK8JXBGmWbi5zG926xeJXdiZsebwttMYWMvWxW\nIwjft5snOJYiSoUg0OJtc9jdzGsP4NQ+utGudRT4GQKBgQD6wq0Kbzf9xhp5oEHY\ntDsmB9aLjCw14dtmVSQyD8bHJ2RtFTe96Ug7hIg3qw+6dDyw83MJKcvkcUO2OtHE\nzHEaIVKukgcGd9LD3nKstBML9CWGIZa10iMG/hBXoCYO8Ck189/fQ9ifd1XIFDDm\nKhLgLCyF97OsBJpjV45BU7/URQKBgQDcJo2/bDhuSzjiajp8dutUdnaeJS+u6na1\ngQCUj1+N86tM7jvALlfDWxadNOjef5Wida6SL5jdVI/8iloR0w0n9wKOqIdjy5b9\n9YO+Mv/aNcUxaHx317Ro04Sf1ore0EMdPAs9yXl+5z83lvXRDdAdphMxmc5Oy/ph\nvvP05RxBWQKBgGHVTC/S/pRbEv864BXNE3qd+j2Nnb4T9UZyl2GUuCgBHXRVn97P\nQig+Z+rYKZXEPd2HzezYSr1A13skba0LWmEoeRq0zFrgqvFSO4lX5Ep4oZ84QZWE\ne7gBrZySVebkGh/7mu9/h+eHZodeIUnbRmwBsAlAf+/wB9AUW+Lu6tvFAoGAMQKs\nP9dZ4MQCT/WSO69FyLHuylpA+VHdR58GgAxDG5kJo8DNsIUgqK8Yo7rptM72gwpr\n6MOL5ooy2+f5EUrI/QKyoQvHyGHEpZkI0UkNSIj783nta8irs0KTnfnnRJ9csZ9y\naTj3QVc97aQ/6WCH2nHkiABTu5sRjL00FmsDFVECgYAYKDr5riGFgPdT/MJdOYkN\n6z0m0wMjUp2UH5RtmNzbb2K4d5kaD1eNmr0GXgfDfpFAkMW01ROu/IOf2GZqSWoN\nhu7pHbdffc5Eg3/qGFZiJziO+gGx4fj4tqhfM874Wh/vQ2PPINCEKRqga75t3b1v\n5Z0CafUVRlFumQZSNjC3UA==\n-----END PRIVATE KEY-----\n",
  clientEmail: "firebase-adminsdk-fqhat@mobmun-986a2.iam.gserviceaccount.com",
};
if (!firebaseAdmin.apps.length) {
  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
    projectId: "mobmun-986a2",
    storageBucket: "mobmun-986a2.appspot.com",
  });
}

export default firebaseAdmin;
