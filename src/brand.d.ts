declare module '@brand' {
  export const config: {
    storeName: string;
    logo: string;
  };
}

declare module '@brand/firebaseConfig' {
  export const firebaseConfig: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    measurementId: string;
  };
}
