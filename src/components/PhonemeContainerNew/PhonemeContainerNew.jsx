import React, { useState, useEffect } from 'react';
import PhonemeCard from '../PhonemeCard/PhonemeCard';
import axios from 'axios';
import queryOptions from '../queryOptions';
import generateCombinedQuery from '../generateCombinedQuery'

const sparqlUpdateEndpoint = "http://localhost:3030/pho/update";
const sparqlQueryEndpoint = "http://localhost:3030/pho/query";

const PhonemeContainerNew = ({ phonemeData }) => {
  const [selectedQuery, setSelectedQuery] = useState("");
  const [isVoiced, setIsVoiced] = useState("All");
  const [selectedQueryAdditional, setSelectedQueryAdditional] = useState("All phonemes");
  const [phonemes, setPhonemes] = useState([]);

  useEffect(() => {
    const insertData = async (data) => {
      if (!data || data.length === 0) {
        return;
      }

      // Constructing a batch SPARQL INSERT query for all phonemes
      const queries = data.map(phoneme => {
        const id = phoneme['@id'];
        const type = phoneme['@type'].toLowerCase().includes('vowel') ? 'vowel' : 'consonant';
        const symbol = phoneme['phonemes:symbol'];
        const description = phoneme['phonemes:description'];
        const allophones = phoneme['phonemes:allophones'];
        const isVoiced = phoneme['phonemes:isVoiced'];
        const length = phoneme['phonemes:length'];

        if (!id || !symbol || !description) {
          console.error(`Missing required fields for phoneme: id=${id}, symbol=${symbol}, description=${description}`);
          return '';
        }

        // Build languages and dialects INSERT query
        let languagesAndDialectsInsert = '';
        if (phoneme['phonemes:belongsTo'] && phoneme['phonemes:belongsTo'].length > 0) {
          languagesAndDialectsInsert = phoneme['phonemes:belongsTo'].map((language) => {
            let languageInsert = `
              <http://example.com/${language['@id']}> a phonemes:Language ;
                phonemes:languageName "${language['phonemes:languageName']}" ;
                phonemes:languageRegion "${language['phonemes:languageRegion']}" ;
                phonemes:languageDescription "${language['phonemes:languageDescription']}" .
              <http://example.com/${id}> phonemes:belongsTo <http://example.com/${language['@id']}> .
            `;

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

        // Return the SPARQL query part for this phoneme
        return `
          <http://example.com/${id}> a phonemes:Phoneme ;
            phonemes:type "${type}" ;
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

          ${languagesAndDialectsInsert}
        `;
      }).join(" "); // Join all individual phoneme inserts into one string

      const updateQuery = `
        PREFIX phonemes: <https://zimbara14.github.io/phonemes-ontology/Phonemes-ontology-updated.rdf#>
        INSERT DATA {
          ${queries}
        }
      `;

      try {
        await axios.post(
          sparqlUpdateEndpoint,
          `update=${encodeURIComponent(updateQuery)}`,
          { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        );
      } catch (error) {
        console.error("Error inserting batch data for phonemes: ", error.response ? error.response.data : error.message);
      }
    };
    insertData(phonemeData).then(() => setSelectedQuery(queryOptions[0].query));
  }, [phonemeData]);

  // Function to generate JSON-LD structured data
  const generateJsonLd = (phonemes) => {
    const jsonLdData = {
      "@context": {
        "phonemes": "https://zimbara14.github.io/phonemes-ontology/Phonemes-ontology-updated.rdf#",
        "schema": "http://schema.org/"
      },
      "@type": "schema:WebPage",
      "schema:name": "Phonemes Project",
      "schema:description": "A project to demonstrate phonemes ontology and data.",
      "phonemes:phonemeCollection": phonemes.map(phoneme => ({
        "@id": `phonemes:Phoneme#${phoneme.symbol}`,
        "@type": `${phoneme.type}`, // type things!
        "phonemes:symbol": phoneme.symbol,
        "phonemes:description": phoneme.description,
        "phonemes:allophones": phoneme.allophones,
        "phonemes:isVoiced": phoneme.isVoiced ? "true" : "false",
        "phonemes:length": phoneme.length,

        ...(phoneme.articulationManner && {
          "phonemes:articulationManner": phoneme.articulationManner,
          "phonemes:articulationPlace": phoneme.articulationPlace,
          "phonemes:airstreamMechanism": phoneme.airstreamMechanism,
          "phonemes:sonority": phoneme.sonority,
          "phonemes:isAspirated": phoneme.isAspirated === 'yes' ? "true" : "false",
        }),

        ...(phoneme.tension && {
          "phonemes:tension": phoneme.tension,
          "phonemes:height": phoneme.height,
          "phonemes:backness": phoneme.backness,
          "phonemes:isRounded": phoneme.isRounded ? "true" : "false",
        }),

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

    return JSON.stringify(jsonLdData, null, 2); // Return formatted JSON-LD
  };

  // Effect to inject the JSON-LD script into the head when phonemes are updated
  useEffect(() => {
    if (phonemes.length > 0) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.innerHTML = generateJsonLd(phonemes);
      document.head.appendChild(script);

      // Clean up the script on component unmount or when phonemes change
      return () => {
        document.head.removeChild(script);
      };
    }
  }, [phonemes]);

  const fetchData = async () => {
    if (!selectedQuery) return;

    const combinedQuery = generateCombinedQuery(selectedQueryAdditional, isVoiced);

    try {
      const response = await axios.get(sparqlQueryEndpoint, {
        params: { query: combinedQuery},
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
  }, [selectedQuery, selectedQueryAdditional, isVoiced]);

  return (
    <div>
      <h1 className="phoneme-title">Phonemes</h1>
      <div className="query-selector">
        <select
          value={selectedQuery}
          onChange={(e) => {
            setSelectedQuery(e.target.value);
            setSelectedQueryAdditional(e.target.options[e.target.selectedIndex].text)
          }}
          className="query-dropdown"
        >
          {queryOptions.map((option, index) => (
            <option key={index} value={option.query}>
              {option.label}
            </option>
          ))}
        </select>
        <select
          value={isVoiced}
          onChange={(e) => {
            const selectedValue = e.target.value;
            setIsVoiced(selectedValue);
          }}
          className="query-dropdown"
        >
          <option value="All">All (Voiced and Unvoiced)</option>
          <option value="Voiced">Voiced</option>
          <option value="Unvoiced">Unvoiced</option>
        </select>
      </div>
      <div className="phoneme-container">
        {phonemes.map((phoneme, index) => (
          <PhonemeCard key={index} props={phoneme} />
        ))}
      </div>
      <div>
        <i><b>{phonemes.length}</b> out of 16 registered phonemes</i>
      </div>
    </div>
  );
};

export default PhonemeContainerNew;
