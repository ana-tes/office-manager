import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth0 } from '../../contexts/auth0-context';

const withRouter = (WrappedComponent: any) => (props: any) => {
  const params = useParams();
  return (
    <WrappedComponent
      {...props}
      params={params}
    />
  );
};

function Create(): JSX.Element {
  const navigate = useNavigate();
  const { user, getIdTokenClaims } = useAuth0();

  interface IValues {
    [key: string]: any;
  }
  const [author, setAuthor] = useState<string>('');
  const [values, setValues] = useState<IValues>([]);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      setAuthor(user.name)
    }
  }, [user])

  const handleFormSubmission = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    const formData = {
      login: values.login,
      firstName: values.firstName,
      lastName: values.lastName,
      photo: values.photo,
      position: values.position,
    }
    const submitSuccess: boolean = await submitform(formData);
    setSubmitSuccess(submitSuccess);
    setValues({ ...values, formData });
    setLoading(false);
    setTimeout(() => {
      navigate('/');
    }, 1500);
  }

  const submitform = async (formData: {}) => {
    try {
      const accessToken = await getIdTokenClaims();
      const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/user`, {
        method: "user",
        headers: new Headers({
          "Content-Type": "application/json",
          "Accept": "application/json",
          "authorization": `Bearer ${accessToken.__raw}`
        }),
        body: JSON.stringify(formData)
      });
      return response.ok;
    } catch (ex) {
      return false;
    }
  }
  const setFormValues = (formValues: IValues) => {
    setValues({ ...values, ...formValues })
  }
  const handleInputChanges = (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    setFormValues({ [e.currentTarget.name]: e.currentTarget.value })
  }
  return (
    <div>
      <div className={"col-md-12 form-wrapper"}>
        <h2> Create User </h2>
        {!submitSuccess && (
          <div className="alert alert-info" role="alert">
            Fill the form below to create a new user.
          </div>
        )}
        {submitSuccess && (
          <div className="alert alert-info" role="alert">
            The form was successfully submitted!
          </div>
        )}
        <form id={"create-user-form"} onSubmit={handleFormSubmission} noValidate={true}>
          <div className="form-group col-md-12">
            <label htmlFor="firstName"> First Name </label>
            <input type="text" id="firstName" onChange={(e) => handleInputChanges(e)} name="firstName" className="form-control" placeholder="Enter firstName" />
          </div>
          <div className="form-group col-md-12">
            <label htmlFor="lastName"> Last Name </label>
            <input type="text" id="lastName" onChange={(e) => handleInputChanges(e)} name="lastName" className="form-control" placeholder="Enter lastName" />
          </div>
          <div className="form-group col-md-12">
            <label htmlFor="login"> Login </label>
            <input type="text" id="login" onChange={(e) => handleInputChanges(e)} name="login" className="form-control" placeholder="Enter login" />
          </div>
          <div className="form-group col-md-12">
            <label htmlFor="photo"> Photo </label>
            <input type="text" id="photo" onChange={(e) => handleInputChanges(e)} name="photo" className="form-control" placeholder="Enter photo" />
          </div>
          <div className="form-group col-md-12">
            <label htmlFor="position"> Position </label>
            <input type="text" id="position" defaultValue={author} onChange={(e) => handleInputChanges(e)} name="position" className="form-control" placeholder="Enter position" />
          </div>
          <div className="form-group col-md-4 pull-right">
            <button className="btn btn-success" type="submit">
              Create User
            </button>
            {loading &&
              <span className="fa fa-circle-o-notch fa-spin" />
            }
          </div>
        </form>
      </div>
    </div>
  );
}

export default withRouter(Create);
