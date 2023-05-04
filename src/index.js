import './index.css'
import { Mount } from 'brace-js';
import App from "./App"


Mount(() => <App />, document.querySelector("#root"));