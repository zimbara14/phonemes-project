const queryOptions = [
    {
      label: "All phonemes",
      query: `
      PREFIX phonemes: <https://zimbara14.github.io/phonemes-ontology/Phonemes-ontology-updated.rdf#>
      PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

      SELECT ?phoneme ?symbol ?description ?allophones (STR(?isVoiced) AS ?isVoicedFormatted) ?length
          (STR(?isRounded) AS ?isRoundedFormatted) ?height ?backness ?tension
          ?articulationManner ?articulationPlace ?airstreamMechanism ?sonority ?isAspirated
            (GROUP_CONCAT(DISTINCT CONCAT(?languageName, " (", COALESCE(?dialectName, ""), ")"); separator=", ") AS ?languagesAndDialects)
      WHERE {
        # Retrieve phonemes with the specified properties
        ?phoneme phonemes:symbol ?symbol ;
                phonemes:description ?description ;
                phonemes:allophones ?allophones ;
                phonemes:isVoiced ?isVoiced ;
                phonemes:length ?length .

        # Vowel-specific properties
        OPTIONAL { 
          ?phoneme a phonemes:Vowel ;
                  phonemes:height ?height ;
                  phonemes:backness ?backness ;
                  phonemes:isRounded ?isRounded ;
                  phonemes:tension ?tension .
        }

        # Consonant-specific properties
        OPTIONAL { 
          ?phoneme a phonemes:Consonant ;
                  phonemes:articulationManner ?articulationManner ;
                  phonemes:articulationPlace ?articulationPlace ;
                  phonemes:airstreamMechanism ?airstreamMechanism ;
                  phonemes:sonority ?sonority ;
                  phonemes:isAspirated ?isAspirated .
        }

        # Retrieve associated languages and dialects
        OPTIONAL {
          ?phoneme phonemes:belongsTo ?language .
          ?language phonemes:languageName ?languageName .

          OPTIONAL { ?language phonemes:hasDialect ?dialect .
                    ?dialect phonemes:dialectName ?dialectName . }
        }
      }
      GROUP BY ?phoneme ?symbol ?description ?allophones ?isVoiced ?length ?height ?backness ?isRounded ?tension ?articulationManner ?articulationPlace ?airstreamMechanism ?sonority ?isAspirated
      ORDER BY ?phoneme
      `
    },
    {
      label: "Consonants",
      query:`
      PREFIX phonemes: <https://zimbara14.github.io/phonemes-ontology/Phonemes-ontology-updated.rdf#>
      PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

      SELECT ?phoneme ?symbol ?description ?allophones (STR(?isVoiced) AS ?isVoicedFormatted) ?length
          ?articulationManner ?articulationPlace ?airstreamMechanism ?sonority ?isAspirated
            (GROUP_CONCAT(DISTINCT CONCAT(?languageName, " (", COALESCE(?dialectName, ""), ")"); separator=", ") AS ?languagesAndDialects)
      WHERE {
        # Retrieve phonemes with the specified properties
        ?phoneme a phonemes:Consonant ;
            phonemes:symbol ?symbol ;
                  phonemes:description ?description ;
                  phonemes:allophones ?allophones ;
                  phonemes:isVoiced ?isVoiced ;
                  phonemes:length ?length ;
                  phonemes:articulationManner ?articulationManner ;
                  phonemes:articulationPlace ?articulationPlace ;
                  phonemes:airstreamMechanism ?airstreamMechanism ;
                  phonemes:sonority ?sonority ;
                  phonemes:isAspirated ?isAspirated .

        # Retrieve associated languages and dialects
        OPTIONAL {
          ?phoneme phonemes:belongsTo ?language .
          ?language phonemes:languageName ?languageName .

          OPTIONAL { ?language phonemes:hasDialect ?dialect .
                    ?dialect phonemes:dialectName ?dialectName . }
        }
      }
      GROUP BY ?phoneme ?symbol ?description ?allophones ?isVoiced ?length ?articulationManner ?articulationPlace ?airstreamMechanism ?sonority ?isAspirated
      ORDER BY ?phoneme
      `
    },
    {
      label: 'Vowels',
      query: `
      PREFIX phonemes: <https://zimbara14.github.io/phonemes-ontology/Phonemes-ontology-updated.rdf#>
        PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

        SELECT ?phoneme ?symbol ?description ?allophones (STR(?isVoiced) AS ?isVoicedFormatted) ?length
            (STR(?isRounded) AS ?isRoundedFormatted) ?height ?backness ?tension
              (GROUP_CONCAT(DISTINCT CONCAT(?languageName, " (", COALESCE(?dialectName, ""), ")"); separator=", ") AS ?languagesAndDialects)
        WHERE {
          # Retrieve phonemes with the specified properties
          ?phoneme a phonemes:Vowel ;
              phonemes:symbol ?symbol ;
                  phonemes:description ?description ;
                  phonemes:allophones ?allophones ;
                  phonemes:isVoiced ?isVoiced ;
                  phonemes:length ?length ;
                  phonemes:height ?height ;
                  phonemes:backness ?backness ;
                  phonemes:isRounded ?isRounded ;
                  phonemes:tension ?tension .

          # Retrieve associated languages and dialects
          OPTIONAL {
            ?phoneme phonemes:belongsTo ?language .
            ?language phonemes:languageName ?languageName .

            OPTIONAL { ?language phonemes:hasDialect ?dialect .
                      ?dialect phonemes:dialectName ?dialectName . }
          }
        }
        GROUP BY ?phoneme ?symbol ?description ?allophones ?isVoiced ?length ?height ?backness ?isRounded ?tension 
        ORDER BY ?phoneme
      `
    },
    {
      label: 'Voiced',
      query:`
        PREFIX phonemes: <https://zimbara14.github.io/phonemes-ontology/Phonemes-ontology-updated.rdf#>
        PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

        SELECT ?phoneme ?symbol ?description ?allophones (STR(?isVoiced) AS ?isVoicedFormatted) ?length
            (STR(?isRounded) AS ?isRoundedFormatted) ?height ?backness ?tension
            ?articulationManner ?articulationPlace ?airstreamMechanism ?sonority ?isAspirated
              (GROUP_CONCAT(DISTINCT CONCAT(?languageName, " (", COALESCE(?dialectName, ""), ")"); separator=", ") AS ?languagesAndDialects)
        WHERE {
          # Retrieve phonemes with the specified properties
          ?phoneme phonemes:symbol ?symbol ;
                  phonemes:description ?description ;
                  phonemes:allophones ?allophones ;
                  phonemes:isVoiced ?isVoiced ;
                  phonemes:length ?length .

          # Filter for only voiced phonemes
          FILTER(?isVoiced = true)

          # Vowel-specific properties
          OPTIONAL { 
            ?phoneme a phonemes:Vowel ;
                    phonemes:height ?height ;
                    phonemes:backness ?backness ;
                    phonemes:isRounded ?isRounded ;
                    phonemes:tension ?tension .
          }

          # Consonant-specific properties
          OPTIONAL { 
            ?phoneme a phonemes:Consonant ;
                    phonemes:articulationManner ?articulationManner ;
                    phonemes:articulationPlace ?articulationPlace ;
                    phonemes:airstreamMechanism ?airstreamMechanism ;
                    phonemes:sonority ?sonority ;
                    phonemes:isAspirated ?isAspirated .
          }

          # Retrieve associated languages and dialects
          OPTIONAL {
            ?phoneme phonemes:belongsTo ?language .
            ?language phonemes:languageName ?languageName .

            OPTIONAL { ?language phonemes:hasDialect ?dialect .
                      ?dialect phonemes:dialectName ?dialectName . }
          }
        }
        GROUP BY ?phoneme ?symbol ?description ?allophones ?isVoiced ?length ?height ?backness ?isRounded ?tension ?articulationManner ?articulationPlace ?airstreamMechanism ?sonority ?isAspirated
        ORDER BY ?phoneme
      `
    },
    {
      label: 'Unvoiced',
      query:`
        PREFIX phonemes: <https://zimbara14.github.io/phonemes-ontology/Phonemes-ontology-updated.rdf#>
        PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

        SELECT ?phoneme ?symbol ?description ?allophones (STR(?isVoiced) AS ?isVoicedFormatted) ?length
            (STR(?isRounded) AS ?isRoundedFormatted) ?height ?backness ?tension
            ?articulationManner ?articulationPlace ?airstreamMechanism ?sonority ?isAspirated
              (GROUP_CONCAT(DISTINCT CONCAT(?languageName, " (", COALESCE(?dialectName, ""), ")"); separator=", ") AS ?languagesAndDialects)
        WHERE {
          # Retrieve phonemes with the specified properties
          ?phoneme phonemes:symbol ?symbol ;
                  phonemes:description ?description ;
                  phonemes:allophones ?allophones ;
                  phonemes:isVoiced ?isVoiced ;
                  phonemes:length ?length .

          # Filter for only voiced phonemes
          FILTER(?isVoiced = false)

          # Vowel-specific properties
          OPTIONAL { 
            ?phoneme a phonemes:Vowel ;
                    phonemes:height ?height ;
                    phonemes:backness ?backness ;
                    phonemes:isRounded ?isRounded ;
                    phonemes:tension ?tension .
          }

          # Consonant-specific properties
          OPTIONAL { 
            ?phoneme a phonemes:Consonant ;
                    phonemes:articulationManner ?articulationManner ;
                    phonemes:articulationPlace ?articulationPlace ;
                    phonemes:airstreamMechanism ?airstreamMechanism ;
                    phonemes:sonority ?sonority ;
                    phonemes:isAspirated ?isAspirated .
          }

          # Retrieve associated languages and dialects
          OPTIONAL {
            ?phoneme phonemes:belongsTo ?language .
            ?language phonemes:languageName ?languageName .

            OPTIONAL { ?language phonemes:hasDialect ?dialect .
                      ?dialect phonemes:dialectName ?dialectName . }
          }
        }
        GROUP BY ?phoneme ?symbol ?description ?allophones ?isVoiced ?length ?height ?backness ?isRounded ?tension ?articulationManner ?articulationPlace ?airstreamMechanism ?sonority ?isAspirated
        ORDER BY ?phoneme
      `
    },
    {
      label: 'By language',
      query: `
      PREFIX phonemes: <https://zimbara14.github.io/phonemes-ontology/Phonemes-ontology-updated.rdf#>
      PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

      SELECT ?phoneme ?symbol ?description ?allophones (STR(?isVoiced) AS ?isVoicedFormatted) ?length
          (STR(?isRounded) AS ?isRoundedFormatted) ?height ?backness ?tension
          ?articulationManner ?articulationPlace ?airstreamMechanism ?sonority ?isAspirated
            (GROUP_CONCAT(DISTINCT CONCAT(?languageName, " (", COALESCE(?dialectName, ""), ")"); separator=", ") AS ?languagesAndDialects)
      WHERE {
        # Retrieve phonemes with the specified properties
        ?phoneme phonemes:symbol ?symbol ;
                phonemes:description ?description ;
                phonemes:allophones ?allophones ;
                phonemes:isVoiced ?isVoiced ;
                phonemes:length ?length .

        # Vowel-specific properties
        OPTIONAL { 
          ?phoneme a phonemes:Vowel ;
                  phonemes:height ?height ;
                  phonemes:backness ?backness ;
                  phonemes:isRounded ?isRounded ;
                  phonemes:tension ?tension .
        }

        # Consonant-specific properties
        OPTIONAL { 
          ?phoneme a phonemes:Consonant ;
                  phonemes:articulationManner ?articulationManner ;
                  phonemes:articulationPlace ?articulationPlace ;
                  phonemes:airstreamMechanism ?airstreamMechanism ;
                  phonemes:sonority ?sonority ;
                  phonemes:isAspirated ?isAspirated .
        }

        # Filter by the specified language
        OPTIONAL {
          ?phoneme phonemes:belongsTo ?language .
          ?language phonemes:languageName ?languageName .

          OPTIONAL { ?language phonemes:hasDialect ?dialect .
                    ?dialect phonemes:dialectName ?dialectName . }
        }
        
        # Filter for a specific language (replace "LANGUAGE_NAME" with the desired language)
        FILTER(CONTAINS(LCASE(?languageName), LCASE("LANGUAGE_NAME")))
      }
      GROUP BY ?phoneme ?symbol ?description ?allophones ?isVoiced ?length ?height ?backness ?isRounded ?tension ?articulationManner ?articulationPlace ?airstreamMechanism ?sonority ?isAspirated
      ORDER BY ?phoneme
      `
    }
  ]

  export default queryOptions;