import React, { useState, useEffect, ChangeEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Avatar,
  FormControl,
  InputLabel,
  TextField,
  Select,
  MenuItem,
  Button,
  SelectChangeEvent
} from '@mui/material';
import { styled } from '@mui/material/styles';
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
  const [teams, setTeams] = useState([]);
  const [image, setImage] = useState<{filename: string, url: string} | null>(null);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const Input = styled('input')({
    display: 'none',
  });

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
      team: values.team,
    }
    const submitSuccess: boolean = await submitform(formData);
    setSubmitSuccess(submitSuccess);
    setValues({ ...values, formData });
    setLoading(false);
    setTimeout(() => {
      navigate('/');
    }, 1500);
  }

  const submitform = async (formData: any) => {
    try {
      if (image?.filename) {
        formData['photo'] = image.filename;
      }
      const accessToken = await getIdTokenClaims();
      const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/user`, {
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

  const handleTeamChanges = (e: SelectChangeEvent<any>) => {
    e.preventDefault();
    setFormValues({ "team": e.target.value });
  }

  const handleInputImageChanges = async (e: ChangeEvent<any>) => {

    e.preventDefault();
    const accessToken = await getIdTokenClaims();
    
    const imageData = new FormData();
    imageData.append('file', e.target.files[0]);
    imageData.append('name', e.target.files[0].name);

    fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/avatars`, {
      method: "POST",
      headers: new Headers({
        "authorization": `Bearer ${accessToken.__raw}`
      }),
      body: imageData
    })
      .then(res => res.json())
      .then(
        (image) => {
          image.url = `${process.env.REACT_APP_SERVER_BASE_URL}/avatars/${image.filename}`;
          setImage(image);
        },
        (error) => {
          console.log(error)
          setError(error);
        }
      )
  }

  const deleteAvatarImage = async (imageName: string) => {

    const accessToken = await getIdTokenClaims();
    
    fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/avatars/${imageName}`, {
      method: "DELETE",
      headers: new Headers({
        "authorization": `Bearer ${accessToken.__raw}`
      }),
    })
      .then(res => res.json())
      .then(
        (_) => {
          setImage(null);
        },
        (error) => {
          console.log(error)
          setError(error);
        }
      )
  }

  useEffect(() => {
    const accessToken = getIdTokenClaims();
    fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/team`, {
      method: "GET",
      headers: new Headers({
        "Content-Type": "application/json",
        "Accept": "application/json",
        "authorization": `Bearer ${accessToken.__raw}`
      })
    })
      .then(res => res.json())
      .then(
        (teams) => {
          console.log(teams);
          setIsLoaded(true);
          setTeams(teams);
        },
        (error) => {
          console.log(error)
          setIsLoaded(true);
          setError(error);
        }
      )
  }, [])

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
          <FormControl fullWidth className={classes.selection}>
            <TextField
              label="First Name"
              className={classes.infoStyle}
              color="secondary"
              id="firstName"
              onChange={(e: any) => handleInputChanges(e)}
              name="firstName"
              focused
              />
          </FormControl>
          <FormControl fullWidth className={classes.selection}>
            <TextField
              label="Last Name"
              className={classes.infoStyle}
              color="secondary"
              id="lastName"
              onChange={(e: any) => handleInputChanges(e)}
              name="lastName"
              focused
              />
          </FormControl>
          <FormControl fullWidth className={classes.selection}>
            <TextField
              label="Login"
              className={classes.infoStyle}
              color="secondary"
              id="login"
              onChange={(e: any) => handleInputChanges(e)}
              name="login"
              focused
              />
          </FormControl>
          {
            image?.url &&
            <FormControl fullWidth className={classes.buttonDeleteAvatar}>
              <Avatar
                src={image?.url}
                sx={{ width: 126, height: 126 }}
                />
              <Button variant="outlined" onClick={(e: any) => deleteAvatarImage(image?.filename)}>
                Delete
              </Button>
            </FormControl>
          }
          {
            !image?.url &&
            <FormControl fullWidth className={classes.selection}>
              <label htmlFor="contained-button-file">
                  <Input
                    accept="image/*"
                    id="contained-button-file"
                    multiple type="file"
                    onChange={(e: any) => handleInputImageChanges(e)}
                    />
                  <Button variant="contained" component="span">
                    Upload
                  </Button>
              </label>
            </FormControl>
          }
          <FormControl fullWidth className={classes.selection}>
            <TextField
              label="Position"
              className={classes.infoStyle}
              color="secondary"
              id="position"
              onChange={(e: any) => handleInputChanges(e)}
              name="position"
              focused
              />
          </FormControl>
          <FormControl fullWidth className={classes.selection}>
            <InputLabel id="demo-simple-select-label" color="secondary">Team</InputLabel>
            <Select
              id="demo-simple-select"
              color="secondary"
              label="Team"
              labelId="demo-simple-select-label"
              name="team"
              className={classes.infoStyle}
              onChange={handleTeamChanges}
              >
              {
                  teams?.map((team: {_id: any; name: string}) => (<MenuItem value={team._id}>{team.name}</MenuItem>))
              }
            </Select>
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
