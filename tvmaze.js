/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */


/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */


      // import cdn version of axios
    //   <script src="https://unpkg.com/axios/dist/axios.min.js"></script>

base_url = 'https://api.tvmaze.com ';
/*
for_first_end_point = ' https://api.tvmaze.com/search/shows?q=girls';  // eg
second_end_point = 'https://api.tvmaze.com/shows/1/episodes'            // eg
*/

async function searchShows(query) {
  // TODO: Make an ajax request to the searchShows api.  Remove
  // hard coded data.

    ////////

    // async function getUser() {
    try {
        // let response = await axios.get('https://api.tvmaze.com/shows/1767');  // q=girls
        let response = await axios.get(`https://api.tvmaze.com/shows?q=${query}`);  // q=girls
        // now convert this response to human readable form(eg js dictionary)
        // let parsedString = JSON.parse(response);
        // console.log(parsedString);
        let shows = response.data.map(result => {
            let show = result.show;
            return {
              id: show.id,
              name: show.name,
              summary: show.summary,
              image: show.image ? show.image.medium : MISSING_IMAGE_URL,
            };
          });
          return shows;
        
    } catch (error) {
        // console.error(error);
        console.log(error);
    }
}
/*
  return [
    {
      id: 1767,
      name: "The Bletchley Circle",
      summary: "<p><b>The Bletchley Circle</b> follows the journey of four ordinary women with extraordinary skills that helped to end World War II.</p><p>Set in 1952, Susan, Millie, Lucy and Jean have returned to their normal lives, modestly setting aside the part they played in producing crucial intelligence, which helped the Allies to victory and shortened the war. When Susan discovers a hidden code behind an unsolved murder she is met by skepticism from the police. She quickly realises she can only begin to crack the murders and bring the culprit to justice with her former friends.</p>",
      image: "http://static.tvmaze.com/uploads/images/medium_portrait/147/369403.jpg"
    }
  ]
}
*/


/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
           </div>
         </div>
       </div>
      `);

    $showsList.append($item);
  }
}


/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch (evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);

  populateShows(shows);
});


/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  // TODO: get episodes from tvmaze
  //       you can get this by making GET request to
  //       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes
  //NOTE: pass parameter to the url query string in the form of a variable 
    let response = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
    let episodes = response.data.map(episode => ({
        id: episode.id,
        name: episode.name,
        season: episode.season,
        number: episode.number,
    }));

    return episodes;
}
  // TODO: return array-of-episode-info, as described in docstring above

// MOST OF THIS IS NOT MY ORIGINAL IDEA, help taken from solution. I am not able to fetch API data in my machine either in insomnia or vai curl command line.

function arrayOfEpisodes(episodes) {
    const $episodesList = $("#episodes-list");
    $episodesList.empty();
      
    for (let episode of episodes) {
      let $item = $(
        `<li>
           ${episode.name}
           (season ${episode.season}, episode ${episode.number})
         </li>
        `);
      $episodesList.append($item);
    }
    $("#episodes-area").show();
  }
  /** Handle click on show name. */
  
  $("#shows-list").on("click", ".get-episodes", async function handleEpisodeClick(evt) {
    let showId = $(evt.target).closest(".Show").data("show-id");
    let episodes = await getEpisodes(showId);
    populateEpisodes(episodes);
  });


