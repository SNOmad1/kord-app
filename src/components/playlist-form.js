import React from "react";
import PropTypes from "prop-types";

import Modal from "./modal";
import styles from "../styles/library.module.css";

const PlaylistForm = ({ show, value, onClose, onChange, onSubmit }) => (
  <Modal show={show} onClose={onClose}>
    <h1 className="text-center">{`${value || "New Playlist"}`}</h1>
    <form className={styles.playlistForm} onSubmit={onSubmit}>
      <label htmlFor="playlistname">
        <h2>Enter a playlist name:</h2>
        <input
          ref={input => input && input.focus()}
          id="playlistname"
          type="text"
          placeholder="Playlist Name"
          onChange={e => onChange(e.target.value)}
          value={value}
          // disable auto inputs
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
        />
      </label>

      <button type="submit">Create</button>
    </form>
  </Modal>
);

PlaylistForm.propTypes = {
  show: PropTypes.bool.isRequired,
  value: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

PlaylistForm.defaultProps = {
  value: ""
};

export default PlaylistForm;