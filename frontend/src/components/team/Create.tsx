import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  FormControl,
  TextField,
  Button,
} from '@mui/material';
import { useAuth0 } from '../../contexts/auth0-context';
import { useStyles } from '../../common/styles';

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
  const { classes } = useStyles();
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
      name: values.name,
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
      const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/team`, {
        method: "POST",
        headers: new Headers({
          "Content-Type": "application/json",
          "Accept": "application/json",
          "authorization": `Bearer ${accessToken.__raw}`
        }),
        body: JSON.stringify(formData)
      });
      return response.ok;
    } catch (ex) {
      console.error(ex);
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
            Fill the form below to create a new team.
          </div>
        )}
        {submitSuccess && (
          <div className="alert alert-info" role="alert">
            The form was successfully submitted!
          </div>
        )}
        <form id={"create-user-form"} onSubmit={handleFormSubmission} noValidate={true}>
          <FormControl fullWidth className={classes.selection}>
            <TextField
              id="name"
              onChange={(e: any) => handleInputChanges(e)}
              name="name"
              className={classes.infoStyle}
              label="Name"
              />
          </FormControl>
          <FormControl fullWidth className={classes.buttonSubmit}>
            <Button variant="contained" type="submit">
              Create
            </Button>
            {loading &&
              <span className="fa fa-circle-o-notch fa-spin" />
            }
          </FormControl>
        </form>
      </div>
    </div>
  );
}

export default withRouter(Create);