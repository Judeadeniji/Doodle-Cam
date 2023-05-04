import './index.css'
import { Mount } from 'brace-jsx';
import App from "./App"


Mount(() => <App />, document.querySelector("#root"));