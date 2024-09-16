import React from 'react';
import './PhonemeCard.css';

const PhonemeCard = ( props ) => {

  let symbol = props.props.symbol;
  let description = props.props.description;
  let allophones = props.props.allophones;
  let isVoiced = props.props.isVoicedFormatted
  let length = props.props.length;
  let languagesAndDialects = props.props.languagesAndDialects;
  
  // consonant props
  let airstreamMechanism = props?.props.airstreamMechanism;
  let articulationManner = props?.props.articulationManner;
  let articulationPlace = props?.props.articulationPlace;
  let isAspirated = props?.props.isAspirated;
  let sonority = props?.props.sonority;

  // vowel props
  let height = props?.props.height;
  let isRounded = props?.props.isRoundedFormatted;
  let tension = props?.props.tension;
  let backness = props?.props.backness;

  // vowel or consonant ?
  let isVowel = props.props.height ? true : false;

  function cleanLanguages(inputString) {
    const cleanedString = inputString.replace(/\s*\(\s*\)/g, ''); // Step 1: Remove empty brackets using regex
    const languageMap = {}; // Step 2: Parse languages and dialects into a map
  
    cleanedString.split(',').forEach(part => {
      part = part.trim();
      const match = part.match(/^(\w+)\s*\((.*)\)$/);
      
      if (match) {
        const language = match[1].trim();
        const dialect = match[2].trim();
        
        // Group dialects by language
        if (languageMap[language]) {
          languageMap[language].push(dialect);
        } else {
          languageMap[language] = [dialect];
        }
      } else {
        // Add languages without dialects
        if (!languageMap[part]) {
          languageMap[part] = [];
        }
      }
    });
  
    // Step 3: Reconstruct the final output string
    const outputArray = Object.keys(languageMap).map(language => {
      if (languageMap[language].length > 0) {
        return `${language} (${languageMap[language].join(', ')})`;
      }
      return language;
    });
  
    return outputArray.join(', ');
  }

  return (
    <div className={isVowel ? "phoneme-card red" : "phoneme-card blue"}>
      <div className="phoneme-symbol">/{symbol}/</div>
      <div className="phoneme-details">
        <div className="phoneme-main-details">
          <p><strong>Type:</strong> {isVowel ? "Vowel" : "Consonant"}</p>
          <p><strong>Description:</strong> {description}</p>
          <p><strong>Allophones:</strong> {allophones}</p>
          <p><strong>Voicing:</strong> {isVoiced === "true" ? "voiced" : "unvoiced"}</p>
          <p><strong>Length: </strong>{length}</p>
        </div>
        <hr />
        {airstreamMechanism && <p><strong>Airstream mechanism:</strong> {airstreamMechanism}</p>}
        {articulationManner && <p><strong>Manner of articulation:</strong> {articulationManner}</p>}
        {articulationPlace && <p><strong>Place of articulation:</strong> {articulationPlace}</p>}
        {isAspirated && <p><strong>Aspiration:</strong> {isAspirated ? "aspirated" : "not aspirated"}</p>}
        {sonority && <p><strong>Sonority:</strong> {sonority}</p>}
        {height && <p><strong>Height:</strong> {height}</p>}
        {tension && <p><strong>Tension: </strong>{tension}</p>}
        {backness && <p><strong>Backness:</strong> {backness}</p>}
        {isRounded && <p><strong>Roundness: </strong>{isRounded === "true" ? "rounded" : "unrounded"}</p>}
        <p><strong>Languages and dialects:</strong> {cleanLanguages(languagesAndDialects)}</p>
      </div>
    </div>
  );
};

export default PhonemeCard;
