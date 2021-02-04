import { useSelector } from "react-redux";
import React, { useState, useRef } from "react";

import { secondsToFormatted } from "../utils/formattingHelpers";
import seekBarStyles from "../styles/seek-bar.module.scss";
import largerSeekBarStyles from "../styles/larger-seek-bar.module.scss";

function SeekBar({
  isUserSeeking,
  userSeekPos,
  handleOnChangeUserSeek,
  handleMouseDownSeek,
  handleMouseUpSeek,
  isLargerSeekBar = false,
  withThumb = false
}) {
  const isCurrentTrackFromYoutube =
    useSelector(state => state.player.currentTrack.source) === "youtube";
  const isPlayerExpanded = useSelector(state => state.player.isPlayerExpanded);
  const duration = useSelector(state => state.player.duration);
  const seek = useSelector(state => state.player.seek);
  const [isUserHovering, setIsUserHovering] = useState(false);
  const [hoverOffset, setHoverOffset] = useState(0);
  const seekWrap = useRef(null);
  const styles = isLargerSeekBar ? largerSeekBarStyles : seekBarStyles;
  const seekToolTipOnBottom =
    isCurrentTrackFromYoutube && !isPlayerExpanded && hoverOffset < 200;

  function getPositionOnHover(e) {
    setIsUserHovering(true);

    const parentEl = e.target.getClientRects()[0];

    if (parentEl) {
      const elementLeftOffset = e.target.offsetLeft + e.clientX - parentEl.left;
      setHoverOffset(elementLeftOffset);
    }
  }

  function handleMouseOut() {
    setIsUserHovering(false);
  }

  function calculateProgressPercentage() {
    const progress = (isUserSeeking ? userSeekPos : seek) / duration;

    return progress * 100;
  }

  function calculateTimeRatioFromHoverPosition() {
    const containerWidth = seekWrap.current && seekWrap.current.offsetWidth;
    const hoverRatio = Number(hoverOffset) / Number(containerWidth);

    return hoverRatio * duration;
  }

  function calculateThumbLeftOffset() {
    const containerWidth = seekWrap.current && seekWrap.current.offsetWidth;

    return (calculateProgressPercentage() / 100) * containerWidth - 5;
  }

  return (
    <div className={styles.progressContainer} ref={seekWrap}>
      <input
        className={styles.seekBar}
        type="range"
        min="0"
        max={parseInt(duration || 0)}
        step="any"
        value={isUserSeeking ? userSeekPos : seek || 0}
        onChange={handleOnChangeUserSeek}
        onMouseDown={handleMouseDownSeek}
        onMouseUp={handleMouseUpSeek}
        onMouseMove={getPositionOnHover}
        onMouseOut={handleMouseOut}
      />
      <span className={styles.progressTrack} />
      <span
        className={styles.progressBar}
        style={{ width: `${calculateProgressPercentage()}%` }}
      />
      <span
        className={`${styles.seekToolTip} ${seekToolTipOnBottom &&
          styles.youtubeSeekToolTip}`}
        style={{ left: `${hoverOffset - 20}px` }}
      >
        <span
          className={`${styles.hoverTime} ${isUserHovering &&
            styles.isHovering} ${seekToolTipOnBottom &&
            styles.youtubeHoverTime}`}
        >
          {secondsToFormatted(calculateTimeRatioFromHoverPosition() || 0)}
        </span>
      </span>
      {withThumb && (
        <span
          className={styles.thumb}
          style={{
            left: `${calculateThumbLeftOffset()}px`
          }}
        />
      )}
    </div>
  );
}

export default SeekBar;
