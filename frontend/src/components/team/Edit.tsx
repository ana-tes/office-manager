import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    FormControl,
    TextField,
    Button,
} from '@mui/material';
import { useAuth0 } from '../../contexts/auth0-context';
import { useStyles } from '../../common/styles';

function Edit(): JSX.Element {
    const { getIdTokenClaims } = useAuth0();
    let navigate = useNavigate();
    let { teamId } = useParams();

    interface IValues {
        [key: string]: any;
    }

    const { classes } = useStyles();
    const [user, setUser] = useState<any>()
    const [values, setValues] = useState<IValues>([]);
    const [submitSuccess, setSubmitSuccess] = useState<boolean>(false)
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async (): Promise<void> => {
            const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/team/${teamId}`);
            const json = await response.json();
            setUser(json)
        }
        fetchData();
    }, [teamId]);

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
            const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/team/${teamId}`, {
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
    return (
        <div className={'page-wrapper'}>
            {user &&
                <div className={"col-md-12 form-wrapper"}>
                    <h2> Edit Team  </h2>
                    {submitSuccess && (
                        <div className="alert alert-info" role="alert">
                            The team has been edited successfully!
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
                                defaultValue={user.team}
                                />
                        </FormControl>
                        <FormControl fullWidth className={classes.buttonSubmit}>
                            <Button variant="contained" type="submit">
                                Edit
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