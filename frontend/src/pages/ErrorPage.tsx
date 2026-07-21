import { Link } from "react-router-dom";

function ErrorPage({ errorCode, errorMessage }: { errorCode: number, errorMessage: string }) {
    return (
        <div className="error-page">
            <h1>{errorCode}</h1>
            <p>{errorMessage}</p>

            {errorCode === 403 && <p>You are not authorized to access this page.</p>}

            <Link to="/">Go back to Home</Link>



        </div>
    )
}

export default ErrorPage;
