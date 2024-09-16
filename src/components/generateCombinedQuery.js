const generateCombinedQuery = (selectedType, isVoiced) => {
    let query =
    `PREFIX phonemes: <https://zimbara14.github.io/phonemes-ontology/Phonemes-ontology-updated.rdf#>
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
    
            OPTIONAL { 
            ?language phonemes:hasDialect ?dialect .
            ?dialect phonemes:dialectName ?dialectName . 
            }
        }
    
        # Filter by selectedType (All phonemes, Vowels, Consonants)
        FILTER (
            ("${selectedType}" = "All phonemes") || 
            ("${selectedType}" = "Vowels" && EXISTS { ?phoneme a phonemes:Vowel }) ||
            ("${selectedType}" = "Consonants" && EXISTS { ?phoneme a phonemes:Consonant })
        )
    
        # Filter by isVoiced (Voiced or Unvoiced phonemes)
        FILTER (
            ("${isVoiced}" = "All") || 
            ("${isVoiced}" = "Voiced" && ?isVoiced = true) ||
            ("${isVoiced}" = "Unvoiced" && ?isVoiced = false)
        )
    }
    GROUP BY ?phoneme ?symbol ?description ?allophones ?isVoiced ?length ?height ?backness ?isRounded ?tension ?articulationManner ?articulationPlace ?airstreamMechanism ?sonority ?isAspirated
    ORDER BY ?phoneme    
    `
    return query;
}
  
export default generateCombinedQuery;