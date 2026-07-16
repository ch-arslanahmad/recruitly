import AuthModel from "../components/AuthModel";
import { User } from "../types";

function Login({ setUser }: { setUser: (user: User) => void }) {
    return (
        <AuthModel
            onAuth={(token: string, user: User) => {
                localStorage.setItem("recruitly_token", token);
                localStorage.setItem("recruitly_user", JSON.stringify(user));
                setUser(user);
            }}
        />
    );
}

export default Login;
