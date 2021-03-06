import React, { Component } from 'react';

import "./Auth.css";

import AuthContext from '../context/auth-context';

class AuthPage extends Component {

    state = {
        isLogin: true
    };

    static contextType = AuthContext;

    constructor(props) {
        super(props);
        this.emailEl = React.createRef();
        this.passwordEl = React.createRef();
    }

    submiHandler = (event) => {
        event.preventDefault();
        const email = this.emailEl.current.value;
        const password = this.passwordEl.current.value;

        if (email.trim().length === 0 || password.trim().length === 0) {
            return;
        }

        let requestBody = {
            query: `
            query CreateUser($email: String!, $password:String!){
                login(email : $email , password: $password){
                    userId
                    token
                    tokenExpiration
                }
            }`,
            variables: {
                email: email,
                password:password
            }
        };
        
        if (!this.state.isLogin) {
            requestBody = {
                query: `
                mutation{
                    createUser(userInput: {email: "${email}", password: "${password}"}) {
                        _id
                        email
                    }
                }`
            }
        }

        fetch(process.env.REACT_APP_BACKEND_URL, {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                if (res.status !== 200 && res.status !== 201) {
                    // throw new Error("Faild!")
                }
                return res.json();

            }).then(resData => {
                if (resData.data.login.token) {
                    this.context.login(resData.data.login.token, resData.data.login.userId, resData.data.login.tokenExpiration);
                }
                
            }).catch(err => {
                console.log(err);
        })    
    }

    switchModeHandler = () => {
        this.setState(prevState => {
            return { isLogin: !prevState.isLogin };
        })
    }

    render() {
        return (
        <form className="auth-form" onSubmit={this.submiHandler}>
            <div className="form-control">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" ref={this.emailEl} />
            </div>
            <div className="form-control">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" ref={this.passwordEl} />
            </div>
            <div className="form-action">
                <button type="submit"> {this.state.isLogin ? 'Login' : 'Signup'} </button>
                <button type="button" onClick={this.switchModeHandler}> Switch to {this.state.isLogin ? 'Signup' : 'Login'} </button>
            </div>
            </form>
        )
    }
}

export default AuthPage;