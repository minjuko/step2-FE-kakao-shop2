import React, { useState } from 'react';
import styled from "styled-components";
import InputGroup from "../molecules/InputGroup";
import useInput from "../../hooks/useInput";
import LinkText from "../atoms/LinkText";
import { login } from '../../services/user';
import { useDispatch } from "react-redux";
import { setUser } from "../../store/slices/userSlice";
import { setAuthToken } from "../../utils/localStorage";
import { useNavigate } from 'react-router-dom';
import Title from "../atoms/Title";
import { EMAIL_REGEX, PW_REGEX } from "../../utils/regex";

const staticServerUri = process.env.REACT_APP_PATH || "";

const Container = styled.main`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const Form = styled.form`
    border: 1px solid #c9c8c8;
    padding: 2em;
    margin-bottom: 1em;
`;

const Button = styled.button`
    background-color: #fee500;
    border-width: 0;
    font-size: 1em;
    border-radius: 0px;
    width: 25em;
    height: 3em;
    cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
    opacity: ${(props) => (props.disabled ? 0.6 : 1)};
`;

const LoginForm = () => {
    const dispatch = useDispatch();
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { value, handleOnChange } = useInput({
        email: "",
        password: "",
    });

    const [invalidCheck, setInvalidCheck] = useState({
        email: "",
        password: "",
    });

    const checkRegex = (inputName, inputValue) => {
        let result;
        if (value[inputName].length === 0) {
            result = 'required';
        } else {
            switch (inputName) {
                case 'email':
                    result = EMAIL_REGEX.test(inputValue) ? true : 'invalidEmail';
                    break;
                case 'password':
                    result = PW_REGEX.test(inputValue) ? true : 'invalidPw';
                    break;
                default:
                    return;
            }
        }
        setInvalidCheck((prev) => ({ ...prev, [inputName]: result }));
    };

    const handleOnCheck = (e) => {
        const { name, value } = e.target;
        checkRegex(name, value);
    };

    /**
     * 로그인 API 에러 캐칭 시나리오
     * 1. 401: 이메일 또는 비밀번호가 일치하지 않는다는 서버 메시지를 표시한다.
     * 2. 네트워크 오류: 로그인 실패 기본 메시지를 화면에 표시한다.
     * 3. 그 외 서버 오류: 서버 메시지가 있으면 우선 표시하고 재제출할 수 있게 한다.
     */
    const loginReq = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        setError("");

        try {
            const res = await login({
                email: value.email,
                password: value.password,
            });
            const token = res.headers.authorization;
            dispatch(setUser({ user: token }));
            setAuthToken(token, 1000 * 60 * 60 * 24);
            navigate(staticServerUri + "/");
        } catch (err) {
            setError(err.response?.data?.error?.message ?? "로그인에 실패했습니다.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const navigate = useNavigate();

    const isValid = Object.values(invalidCheck).every((value) => value === true);

    return (
        <>
            <Container>
                <Title>로그인</Title>
                <Form onSubmit={loginReq} noValidate>
                    <InputGroup
                        id="email"
                        name="email"
                        type="email"
                        placeholder="이메일"
                        label="이메일 (아이디)"
                        value={value.email}
                        onChange={handleOnChange}
                        onBlur={handleOnCheck}
                        invalid={invalidCheck}
                        autoComplete="email"
                        required
                    />
                    <InputGroup
                        id="password"
                        name="password"
                        type="password"
                        placeholder="비밀번호"
                        label="비밀번호"
                        value={value.password}
                        onChange={handleOnChange}
                        onBlur={handleOnCheck}
                        invalid={invalidCheck}
                        autoComplete="current-password"
                        required
                    />
                    {error && <p className="mb-4 border border-red-100 bg-red-50 p-2 text-red-600" role="alert">{error}</p>}
                    <Button type="submit" disabled={!isValid || isSubmitting}>
                        {isSubmitting ? "로그인 중..." : "로그인"}
                    </Button>
					<div className="text-0.8em mt-1.5em">
                        <LinkText to={staticServerUri + "/signup"} text="회원가입" />
                    </div>
                </Form>
            </Container>
        </>
    );
};

export default LoginForm;
