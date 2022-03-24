import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';

function Post() {
    let { teamId } = useParams();
    const [user, setPost] = useState<any>({});

    useEffect(() => {
        const fetchData = async (): Promise<void> => {
            const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/team/${teamId}`);
            const json = await response.json();
            setPost(json);
        }
        fetchData();
    }, [teamId]);

    return (
        <section className="user-area">
            <div className="container">
                <div className="row">
                    <div className="col-lg-1 col-md-0" />
                    <div className="col-lg-10 col-md-12">
                        {user &&
                            <div className="main-user">
                                <div className="user-top-area">
                                    <h5 className="pre-title">Office Managenent</h5>
                                    <p className="para">
                                        {user.team}
                                    </p>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </section>
    );
}
export default Post;