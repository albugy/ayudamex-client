import React, { useState, useEffect } from "react";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import { useAppContext } from "../libs/contextLib";
import { onError } from "../libs/errorLib";
import "./Home.css";
import { API } from "aws-amplify";
import { LinkContainer } from "react-router-bootstrap";
export default function Home() {
    const [causes, setNotes] = useState([]);
    const { isAuthenticated } = useAppContext();
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        async function onLoad() {
            if (!isAuthenticated) {
                return;
            }

            try {
                const causes = await loadNotes();
                setNotes(causes);
            } catch (e) {
                onError(e);
            }

            setIsLoading(false);
        }

        onLoad();
    }, [isAuthenticated]);

    function loadNotes() {
        return API.get("cause", "/causes");
    }
    function renderNotesList(causes) {
        return [{}].concat(causes).map((cause, i) =>
            i !== 0 ? (
                <LinkContainer key={cause.cause_id} to={`/causes/${cause.cause_id}`}>
                    <ListGroupItem header={i}>
                        {"Created: " + cause.creation_date}
                    </ListGroupItem>
                </LinkContainer>
            ) : (
                    <LinkContainer key="new" to="/notes/new">
                        <ListGroupItem>
                            <h4>
                                <b>{"\uFF0B"}</b> Crea una nueva causa
          </h4>
                        </ListGroupItem>
                    </LinkContainer>
                )
        );
    }

    function renderLander() {
        return (
            <div className="lander">
                <h1>AyudaMex</h1>
                <p>Una causa de vida</p>
            </div>
        );
    }

    function renderNotes() {
        return (
            <div className="notes">
                <PageHeader>Causas</PageHeader>
                <ListGroup>
                    {!isLoading && renderNotesList(causes)}
                </ListGroup>
            </div>
        );
    }

    return (
        <div className="Home">
            {isAuthenticated ? renderNotes() : renderLander()}
        </div>
    );
}

