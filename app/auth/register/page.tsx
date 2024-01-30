//rsc - react stateless component
import { RegisterForm } from "@/components/auth/register-form";

//The flow works as follows:
//RegisterForm sends information from the front-end to the back-end via the register action.
//Register action creates a verification token based on the user's email
//In lib/mail we use a package called resend which sends the user an email with a confirmation link. In the url there is a token which we can get from params. A unique url is also sent to the user.
//In routes.ts we make the route that was sent to the user public so when they click on it they are brought to page (new-verification.tsx), where the token is extracted from the URL
//Token is used to find the user's email in the database. If the token / email are compatible, then the user's email is verified (db is updated with date of email verification) and they are then allowed to login
const RegisterPage = () => {
  return <RegisterForm />;
};

export default RegisterPage;
