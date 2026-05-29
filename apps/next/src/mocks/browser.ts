import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

// 브라우저용 MSW 워커 설정
const worker = setupWorker(...handlers);

export default worker;
