import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';

function Post() {
    let { postId } = useParams();
    const [user, setPost] = useState<any>({});

    useEffect(() => {
        const fetchData = async (): Promise<void> => {
            const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/blog/user/${postId}`);
            const json = await response.json();
            setPost(json);
        }
        fetchData();
    }, [postId]);

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
                                    <h3 className="firstLastName">
                                        <span>
                                            <b>{user.firstName + user.lastName}</b>
                                        </span>
                                    </h3>
                                    <p className="para">
                                        {user.position}
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