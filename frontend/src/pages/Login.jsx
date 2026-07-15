import AuthModel from '../components/AuthModel';

function Login({ setUser }) {
    return (
        <AuthModel
            onAuth={(token, user) => {
                localStorage.setItem("recruitly_token", token);
                localStorage.setItem("recruitly_user", JSON.stringify(user));
                setUser({ token, ...user });
            }}
        />
    )
}

export default Login;
