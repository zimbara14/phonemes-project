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
    }
  ]

  export default queryOptions;