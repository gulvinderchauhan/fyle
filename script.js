const apiUrl = 'https://api.github.com/users/';
const repositoriesContainer = document.getElementById('repositories');
const paginationContainer = document.getElementById('pagination');
const loader = document.getElementById('loader');

let currentPage = 1;
//const repositoriesPerPage = 10;
async function showProfilePhoto(userData){
  const profilePhoto = document.createElement('img');
    profilePhoto.src = userData.avatar_url;
    profilePhoto.alt = 'Profile Photo';
    repositoriesContainer.appendChild(profilePhoto);
    console.log(userData.avatar_url);

}
async function fetchRepositoriesLimit(){
  const repositoriesPerPageLimit = document.getElementById('limitRepo').value;
  fetchRepositories(repositoriesPerPageLimit);
}
async function fetchRepositories(repositoriesPerPage) {
  const username = document.getElementById('username').value;

  repositoriesContainer.innerHTML = '';
  paginationContainer.innerHTML = '';
  loader.style.display = 'block';

  try {
    // Fetch user details to get profile photo
    const userResponse = await fetch(`${apiUrl}${username}`);
    const userData = await userResponse.json();

    // Fetch user repositories
    const repositoriesResponse = await fetch(`${apiUrl}${username}/repos`);
    const repositories = await repositoriesResponse.json();

    loader.style.display = 'none';

    if (repositories.length === 0) {
      repositoriesContainer.innerHTML = '<p>No repositories found.</p>';
      return;
    }

    // Display user profile photo
    
    // Display repositories
    displayRepositories(repositories, currentPage, repositoriesPerPage,userData);

    // Implement pagination
    const totalPages = Math.ceil(repositories.length / repositoriesPerPage);
    for (let i = 1; i <= totalPages; i++) {
      const pageButton = document.createElement('button');
      pageButton.textContent = i;
      pageButton.onclick = () => showPage(i, repositories,repositoriesPerPage,userData);
      paginationContainer.appendChild(pageButton);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    loader.style.display = 'none';
    repositoriesContainer.innerHTML = '<p>Error fetching data. Please try again.</p>';
  }
}

function displayRepositories(repositories, page, repositoriesPerPage,userData) {
  const startIndex = (page - 1) * repositoriesPerPage;
  const endIndex = page * repositoriesPerPage;
  // console.log(endIndex, repositoriesPerPage);
  showProfilePhoto(userData)
  repositories.slice(startIndex, endIndex).forEach(repository => {
    const repositoryDiv = document.createElement('div');
    repositoryDiv.className = 'repository';
    repositoryDiv.innerHTML = `
      <div>
        <h3>${repository.name}</h3>
        <p>${repository.description || 'No description available.'}</p>
        <p>Topics: ${repository.topics.join(', ')}</p>
      </div>
      
    `;
    repositoriesContainer.appendChild(repositoryDiv);
  });
}

function showPage(page, repositories,repositoriesPerPage,userData) {
  currentPage = page;
  // console.log(currentPage,repositoriesPerPage);
  
  repositoriesContainer.innerHTML = '';
  displayRepositories(repositories, currentPage,repositoriesPerPage,userData);
}
