import AuthModel from '../components/AuthModel';

function Login({ setUser }) {
    return (
        <AuthModel
            onDone={(username, role) => {
                setUser({ username, role });
            }}
        />
    )
}

export default Login;
