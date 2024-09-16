// const UpdateEndpoint = () => {
//     return (
//         <div className="App">
//           <header className="App-header">
//             <h1>Welcome to Your Music Website</h1>
//             <p>This is a sample web page.</p>
//           </header>
//           <div className="query-selector">
//             <select
//               value={selectedQuery}
//               onChange={(e) => setSelectedQuery(e.target.value)}
//               className="query-dropdown"
//             >
//               <option value="">Select a Query</option>
//               {queryOptions.map((option, index) => (
//                 <option key={index} value={option.query}>
//                   {option.label}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div className="Content">
//             {currentTracks.map((track, index) => (
//               <div key={index} className="MusicTrack">
//                 <h2>{track.title}</h2>
//                 {renderTrackInfo(track)}
//               </div>
//             ))}
//           </div>
//           <div className="Pagination">
//             <button onClick={prevPage} disabled={currentPage === 1}>
//               Previous
//             </button>
//             <button
//               onClick={nextPage}
//               disabled={currentPage === Math.ceil(tracks.length / itemsPerPage)}
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       );
    
// };

// export default UpdateEndpoint