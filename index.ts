import app from './src/app';
import { SERVER_PORT } from './src/configs';

app.listen(SERVER_PORT, () => {
  console.log(`Server is running on PORT: ${SERVER_PORT}`);
});