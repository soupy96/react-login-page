import React, { useState, useEffect, useReducer, useContext } from 'react';

import AuthContext from '../../context/auth-context';
import Card from '../UI/Card/Card';
import Button from '../UI/Button/Button';
import Input from '../UI/Input/Input';

import classes from './Login.module.css';

// this can be outside the component function because it doesnt need to interact with anything defined inside the component function
// all the data used in this function will be passed into this function when its executed by React
const emailReducer = (state, action) => {
  if (action.type === 'USER_INPUT') {
    return { value: action.val, isValid: action.val.includes('@') };
  }
  if (action.type === 'INPUT_BLUR') {
    return { value: state.value, isValid: state.value.includes('@') };
  }
  return { value: '', isValid: false };
};

const passwordReducer = (state, action) => {
  if (action.type === 'USER_INPUT') {
    return { value: action.val, isValid: action.val.trim().length > 6 };
  }
  if (action.type === 'INPUT_BLUR') {
    return { value: state.value, isValid: state.value.trim().length > 6 };
  }
  return { value: '', isValid: false };
};

const Login = (props) => {
  // const [enteredEmail, setEnteredEmail] = useState('');
  // const [emailIsValid, setEmailIsValid] = useState();
  // const [enteredPassword, setEnteredPassword] = useState('');
  // const [passwordIsValid, setPasswordIsValid] = useState();
  const [formIsValid, setFormIsValid] = useState(false);

  const [emailState, dispatchEmail] = useReducer(emailReducer, {
    value: '',
    isValid: null,
  });

  const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
    value: '',
    isValid: null,
  });

  const authCtx = useContext(AuthContext);

  // useEffect(() => {
  //   console.log('EFFECT RUNNING');

  //   return () => {
  //     console.log('EFFECT CLEANUP');
  //   };
  // }, [enteredPassword]);
  // useEffect without a second param runs AFTER every component render cycle
  // with an empty array the useEffect will only run once and thats when the app starts up
  // with a dependency it reruns whenever the component is re-evaludated and the state changes
  // with a cleanup function it runs before the state function as a whole runs but not before the first time it runs
  // with a cleaup function but no dependencies it'll run on the intial load and when the component is removed

  // object destructuring
  // we assign a alias to the extracted property
  // isValid is in the emailState object which goes on the left of the colon(:)
  // we then set w/e value is in isValid in the emailState object to the alias emailIsValid
  // this can also be used with props
  const { isValid: emailIsValid } = emailState;
  const { isValid: passwordIsValid } = emailState;

  useEffect(() => {
    const identifier = setTimeout(() => {
      // this code only runs once for each keystroke
      console.log('Checking form Validity!');
      setFormIsValid(emailIsValid && passwordIsValid);
    }, 500);

    // you can only return one thing, a function, clean-up function
    // this runs before each useEffect execution except the very first one
    return () => {
      console.log('CLEANUP');
      clearTimeout(identifier);
    };
  }, [emailIsValid, passwordIsValid]);
  // this useEffect will run when either of the two dependencies are changed. this could be state or props
  // the useEffect will run code in response to an event on screen or something updating. this action is a response to another action
  // we dont need to add state updating functions because React guarantees that they never change
  // in browser api's like fetch() and local storage dont change cause they're not realted to the react component render cycle
  // any component-internal variables wouldn't cause the component to be re-evaluated because its defined outside the component

  const emailChangeHandler = (event) => {
    // setEnteredEmail(event.target.value);
    dispatchEmail({ type: 'USER_INPUT', val: event.target.value });

    // setFormIsValid(event.target.value.includes('@') && passwordState.isValid);
  };

  const passwordChangeHandler = (event) => {
    // setEnteredPassword(event.target.value);
    dispatchPassword({ type: 'USER_INPUT', val: event.target.value });

    setFormIsValid(emailState.isValid && event.target.value.trim().length > 6);
  };

  const validateEmailHandler = () => {
    // setEmailIsValid(emailState.isValid);
    dispatchEmail({ type: 'INPUT_BLUR' });
  };

  const validatePasswordHandler = () => {
    // setPasswordIsValid(enteredPassword.trim().length > 6);
    dispatchPassword({ type: 'INPUT_BLUR' });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    authCtx.onLogin(emailState.value, passwordState.value);
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <Input
          id='email'
          label='E-Mail'
          type='email'
          isValid={emailIsValid}
          value={emailState.value}
          onChange={emailChangeHandler}
          onBlur={validateEmailHandler}
        />
        <Input
          id='password'
          label='Password'
          type='password'
          isValid={passwordIsValid}
          value={passwordState.value}
          onChange={passwordChangeHandler}
          onBlur={validatePasswordHandler}
        />
        <div className={classes.actions}>
          <Button type='submit' className={classes.btn} disabled={!formIsValid}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
