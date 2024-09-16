import React, { useState } from 'react';
import PhonemeCard from '../PhonemeCard/PhonemeCard';
import { useEffect } from 'react';
import axios from 'axios';
import queryOptions from '../queryOptions'
import queryOptionsAdditional from '../queryOptionsAdditional';

const sparqlUpdateEndpoint = "http://localhost:3030/pho/update"
const sparqlQueryEndpoint = "http://localhost:3030/pho/query"

const PhonemeContainer = ({ phonemeData }) => {

  const [selectedQuery, setSelectedQuery] = useState("");
  const [selectedQueryAdditional, setSelectedQueryAdditional] = useState("");
  const [phonemes, setPhonemes] = useState([]);

  useEffect(() => {
    const insertData = async (data) => {

      // if (!data || data.length === 0) {
      //   console.log("No data received");
      //   return;
      // }

      // if(phonemeData && phonemeData.length > 0) {
      //   const script = document.createElement('script');
      //   script.type = 'application/ld+json';
      //   script.innerHTML = JSON.stringify(jsonLdData);
      //   document.head.appendChild(script); // Inject it into the head of the document
      //   return () => {
      //     document.head.removeChild(script);
      //   };
      // }

      for (const phoneme of data) {

        const id = phoneme['@id'];
        const symbol = phoneme['phonemes:symbol'];
        const description = phoneme['phonemes:description'];
        const allophones = phoneme['phonemes:allophones'];
        const isVoiced = phoneme['phonemes:isVoiced'];
        const length = phoneme['phonemes:length'];
        

        // Skip phoneme if required fields are missing
        if (!id || !symbol || !description) {
          console.error(`Missing required fields for phoneme: id=${id}, symbol=${symbol}, description=${description}`);
          continue;
        }

        // Build languages and dialects INSERT query
        let languagesAndDialectsInsert = "";
        if (phoneme['phonemes:belongsTo'] && phoneme['phonemes:belongsTo'].length > 0) {
          languagesAndDialectsInsert = phoneme['phonemes:belongsTo'].map((language) => {
            // Insert the language itself
            let languageInsert = `
              <http://example.com/${language['@id']}> a phonemes:Language ;
                phonemes:languageName "${language['phonemes:languageName']}" ;
                phonemes:languageRegion "${language['phonemes:languageRegion']}" ;
                phonemes:languageDescription "${language['phonemes:languageDescription']}" .
              <http://example.com/${id}> phonemes:belongsTo <http://example.com/${language['@id']}> .
            `;

            // Insert dialects for the language, if any
            if (language['phonemes:hasDialect'] && language['phonemes:hasDialect'].length > 0) {
              const dialectsInsert = language['phonemes:hasDialect'].map((dialect) => `
                <http://example.com/${dialect['@id']}> a phonemes:Dialect ;
                  phonemes:dialectName "${dialect['phonemes:dialectName']}" ;
                  phonemes:dialectRegion "${dialect['phonemes:dialectRegion']}" ;
                  phonemes:dialectDescription "${dialect['phonemes:dialectDescription']}" .
                <http://example.com/${language['@id']}> phonemes:hasDialect <http://example.com/${dialect['@id']}> .
              `).join(" ");
              languageInsert += dialectsInsert;
            }

            return languageInsert;
          }).join(" ");
        }

        // Construct the final SPARQL query
        const updateQuery = `
          PREFIX phonemes: <https://zimbara14.github.io/phonemes-ontology/Phonemes-ontology-updated.rdf#>
          INSERT DATA {
            <http://example.com/${id}> a phonemes:Phoneme ;
              phonemes:symbol "${symbol}" ;
              phonemes:description "${description}" ;
              phonemes:allophones "${allophones}" ;
              phonemes:isVoiced ${isVoiced ? 'true' : 'false'} ;
              phonemes:length "${length}" .

            ${phoneme['@type'] === 'phonemes:Vowel' ? `
            <http://example.com/${id}> a phonemes:Vowel ;
              phonemes:height "${phoneme['phonemes:height'] || ''}" ;
              phonemes:backness "${phoneme['phonemes:backness'] || ''}" ;
              phonemes:isRounded ${phoneme['phonemes:isRounded'] ? 'true' : 'false'} ;
              phonemes:tension "${phoneme['phonemes:tension'] || ''}" .
            ` : `
            <http://example.com/${id}> a phonemes:Consonant ;
              phonemes:articulationManner "${phoneme['phonemes:articulationManner'] || ''}" ;
              phonemes:articulationPlace "${phoneme['phonemes:articulationPlace'] || ''}" ;
              phonemes:airstreamMechanism "${phoneme['phonemes:airstreamMechanism'] || ''}" ;
              phonemes:sonority "${phoneme['phonemes:sonority'] || ''}" ;
              phonemes:isAspirated ${phoneme['phonemes:isAspirated'] === 'yes' ? 'true' : 'false'} .
            `}

            ${phoneme['@type'] === 'phonemes:Consonant' ? `
            <http://example.com/${id}> a phonemes:Consonant ;
              phonemes:articulationManner "${phoneme['phonemes:articulationManner'] || ''}" ;
              phonemes:articulationPlace "${phoneme['phonemes:articulationPlace'] || ''}" ;
              phonemes:airstreamMechanism "${phoneme['phonemes:airstreamMechanism'] || ''}" ;
              phonemes:sonority "${phoneme['phonemes:sonority'] || ''}" ;
              phonemes:isAspirated ${phoneme['phonemes:isAspirated'] === 'yes' ? 'true' : 'false'} .
            ` : ''}

            ${languagesAndDialectsInsert}
          }
        `;

        try {
          await axios.post(
            sparqlUpdateEndpoint,
            `update=${encodeURIComponent(updateQuery)}`,
            { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
          );
        } catch (error) {
          console.error("Error inserting data for phoneme: ", symbol, error.response ? error.response.data : error.message);
        }
      }
    };
    insertData(phonemeData).then(() => setSelectedQuery(queryOptions[0].query));
  }, [phonemeData]);


  const fetchData = async () => {
    if (!selectedQuery) return; // No query selected

    try {
      const response = await axios.get(sparqlQueryEndpoint, {
        params: { query: selectedQuery },
        headers: { Accept: "application/sparql-results+json" },
      });

      const results = response.data.results.bindings.map((binding) => {
        return Object.keys(binding).reduce((acc, key) => {
          acc[key] = binding[key].value;
          return acc;
        }, {});
      });
      setPhonemes(results);
    } catch (error) {
      console.error("Error querying data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedQuery]);

  useEffect(() => {
    if (phonemes.length > 0) {
      // const jsonLdData = {
      //   "@context": "https://schema.org",
      //   "@type": "WebPage",
      //   "name": "Phonemes Project",
      //   "description": "A project to demonstrate phonemes ontology and data.",
      //   "phonemes": phonemes
      // };

      // const script = document.createElement('script');
      // script.type = 'application/ld+json';
      // script.innerHTML = JSON.stringify(jsonLdData);
      // document.head.appendChild(script); // Inject it into the head

      // return () => {
      //   document.head.removeChild(script); // Cleanup to remove the script
      // };
      console.log(phonemes[0])
      const jsonLdData = {
        "@context": {
          "phonemes": "https://zimbara14.github.io/phonemes-ontology/Phonemes-ontology-updated.rdf#",
          "schema": "http://schema.org/"
        },
        "@type": "schema:WebPage",
        "schema:name": "Phonemes Project",
        "schema:description": "A project to demonstrate phonemes ontology and data.",
        "phonemes:phonemeCollection": phonemes.map(phoneme => ({
          "@id": `phonemes:Phoneme#${phoneme.symbol}`, // Assuming unique symbol for each phoneme
          "@type": "phonemes:Phoneme",
          "phonemes:symbol": phoneme.symbol,
          "phonemes:description": phoneme.description,
          "phonemes:allophones": phoneme.allophones,
          "phonemes:isVoiced": phoneme.isVoiced ? "true" : "false",
          "phonemes:length": phoneme.length,
          
          // Only include consonant-specific properties if they exist
          ...(phoneme.articulationManner && {
            "phonemes:articulationManner": phoneme.articulationManner,
            "phonemes:articulationPlace": phoneme.articulationPlace,
            "phonemes:airstreamMechanism": phoneme.airstreamMechanism,
            "phonemes:sonority": phoneme.sonority,
            "phonemes:isAspirated": phoneme.isAspirated === 'yes' ? "true" : "false",
          }),
          
          // Only include vowel-specific properties if they exist
          ...(phoneme.tension && {
            "phonemes:tension": phoneme.tension,
            "phonemes:height": phoneme.height,
            "phonemes:backness": phoneme.backness,
            "phonemes:isRounded": phoneme.isRounded ? "true" : "false",
          }),
  
          // Language and dialect information
          ...(phoneme.belongsTo && phoneme.belongsTo.length > 0 && {
            "phonemes:belongsTo": phoneme.belongsTo.map(language => ({
              "@id": `phonemes:Language#${language.languageName}`,
              "@type": "phonemes:Language",
              "phonemes:languageName": language.languageName,
              "phonemes:languageRegion": language.languageRegion,
              "phonemes:languageDescription": language.languageDescription,
              "phonemes:hasDialect": language.hasDialect.map(dialect => ({
                "@id": `phonemes:Dialect#${dialect.dialectName}`,
                "@type": "phonemes:Dialect",
                "phonemes:dialectName": dialect.dialectName,
                "phonemes:dialectRegion": dialect.dialectRegion,
                "phonemes:dialectDescription": dialect.dialectDescription
              }))
            }))
          })
        }))
      };
  
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.innerHTML = JSON.stringify(jsonLdData);
      document.head.appendChild(script);
  
      return () => {
        document.head.removeChild(script);
      };
    }
  }, [phonemes]); // Runs whenever phonemes are updated

  return (
    <div>
      <h1 className="phoneme-title">Phonemes</h1>
      <div className="query-selector">
        <select
          value={selectedQuery}
          onChange={(e) => setSelectedQuery(e.target.value)}
          className="query-dropdown"
        >
          {/* <option value="">Select a query</option> */}
          {queryOptions.map((option, index) => (
            <option key={index} value={option.query}>
              {option.label}
            </option>
          ))}
        </select>
        <select
          value={selectedQueryAdditional}
          onChange={(e) => setSelectedQueryAdditional(e.target.value)}
          className="query-dropdown"
        >
          <option value="">Select a query</option>
          {queryOptionsAdditional.map((option, index) => (
            <option key={index} value={option.query}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      
      <div className="phoneme-container">
        {phonemes.map((phoneme, index) => (
          <PhonemeCard
            key={index}
            props={phoneme}
          />
        ))}
      </div>
      <div>
        <i><b>{phonemes.length}</b> out of 16 registered phonemes</i>
      </div>
    </div>
  );
};

export default PhonemeContainer;
// query[5] language