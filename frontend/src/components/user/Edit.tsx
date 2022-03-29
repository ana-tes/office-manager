import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  FormControl,
  InputLabel,
  TextField,
  Select,
  MenuItem,
  Button,
  SelectChangeEvent
} from '@mui/material';
import { useAuth0 } from '../../contexts/auth0-context';
import { useStyles } from '../../common/styles';

function Edit(): JSX.Element {
    const { getIdTokenClaims } = useAuth0();
    let navigate = useNavigate();
    let { userId } = useParams();

    interface IValues {
        [key: string]: any;
    }

    const { classes } = useStyles();
    const [user, setUser] = useState<any>()
    const [values, setValues] = useState<IValues>([]);
    const [submitSuccess, setSubmitSuccess] = useState<boolean>(false)
    const [loading, setLoading] = useState(false);
    const [teams, setTeams] = useState([]);
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const fetchData = async (): Promise<void> => {
            const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/user/${userId}`);
            const json = await response.json();
            setUser(json)
        }
        fetchData();
    }, [userId]);

    const handleFormSubmission = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setLoading(true);
        const submitSuccess: boolean = await submitForm();
        setSubmitSuccess(submitSuccess);
        setLoading(false);
        setTimeout(() => {
            navigate('/');
        }, 1500);
    }

    const submitForm = async (): Promise<boolean> => {
        try {
            const accessToken = await getIdTokenClaims();
            const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/user/${userId}`, {
                method: "put",
                headers: new Headers({
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "authorization": `Bearer ${accessToken.__raw}`
                }),
                body: JSON.stringify(values)
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
        setFormValues({ [e.currentTarget.id]: e.currentTarget.value })
    }

    const handleTeamChanges = (e: SelectChangeEvent<any>) => {
      e.preventDefault();
      setFormValues({ "team": e.target.value });
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
        <div className={'page-wrapper'}>
            {user &&
                <div className={"col-md-12 form-wrapper"}>
                    <h2> Edit User  </h2>
                    {submitSuccess && (
                        <div className="alert alert-info" role="alert">
                            The user has been edited successfully!
                        </div>
                    )}
                    <form id={"create-user-form"} onSubmit={handleFormSubmission} noValidate={true}>
                        <FormControl fullWidth className={classes.selection}>
                            <TextField
                                id="firstName"
                                defaultValue={user.firstName}
                                onChange={(e: any) => handleInputChanges(e)}
                                name="firstName"
                                className={classes.infoStyle}
                                label="First name"
                                />
                        </FormControl>
                        <FormControl fullWidth className={classes.selection}>
                            <TextField
                                id="lastName"
                                defaultValue={user.lastName}
                                onChange={(e: any) => handleInputChanges(e)}
                                name="lastName"
                                className={classes.infoStyle}
                                label="Last name"
                                />
                        </FormControl>
                        <FormControl fullWidth className={classes.selection}>
                            <TextField
                                id="photo"
                                defaultValue={user.photo}
                                onChange={(e: any) => handleInputChanges(e)}
                                name="photo"
                                className={classes.infoStyle}
                                label="Photo"
                                />
                        </FormControl>
                        <FormControl fullWidth className={classes.selection}>
                            <TextField
                                id="position"
                                defaultValue={user.position}
                                onChange={(e: any) => handleInputChanges(e)}
                                name="position"
                                className={classes.infoStyle}
                                label="Position"
                                />
                        </FormControl>
                        <FormControl fullWidth className={classes.selection}>
                            <InputLabel id="demo-simple-select-label" color="secondary">Team</InputLabel>
                            <Select
                                id="demo-simple-select"
                                defaultValue={user?.team?._id}
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
                                Edit User
                            </Button>
                            {loading &&
                                <span className="fa fa-circle-o-notch fa-spin" />
                            }
                        </FormControl>
                    </form>
                </div>
            }
        </div>
    )

}
export default Edit;