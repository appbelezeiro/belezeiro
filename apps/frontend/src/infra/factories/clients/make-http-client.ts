import { AxiosHttpClient } from "@/infra/client/axios-http-client"

export const MakeHttpClient = () => {
  return new AxiosHttpClient();
}

export const MakeBelezeiroHttpClient = () => {
  const instance = new AxiosHttpClient();

  instance.setBaseURL("http://localhost:8788")

  return instance;
}


