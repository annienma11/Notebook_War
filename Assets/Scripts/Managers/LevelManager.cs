using UnityEngine;
using NotebookWar.UI;
using NotebookWar.AI;

namespace NotebookWar.Managers
{
    public class LevelManager : MonoBehaviour
    {
        [Header("Level Settings")]
        [SerializeField] private string levelName = "Apartment Complex";
        [SerializeField] private string objective = "Clear all enemies";
        
        [Header("Enemy Management")]
        [SerializeField] private EnemyBase[] enemies;
        [SerializeField] private Transform[] spawnPoints;
        [SerializeField] private GameObject enemyPrefab;
        
        [Header("Checkpoints")]
        [SerializeField] private Transform[] checkpoints;
        
        private HUDManager hudManager;
        private int enemiesRemaining;
        private int currentCheckpoint = 0;

        private void Start()
        {
            hudManager = FindObjectOfType<HUDManager>();
            InitializeLevel();
        }

        private void InitializeLevel()
        {
            // Set initial objective
            if (hudManager != null)
                hudManager.SetObjectiveText($"{objective} ({enemiesRemaining} remaining)");
            
            // Find all enemies in scene
            enemies = FindObjectsOfType<EnemyBase>();
            enemiesRemaining = enemies.Length;
            
            // Spawn additional enemies if needed
            SpawnEnemies();
        }

        private void Update()
        {
            CheckLevelCompletion();
        }

        private void SpawnEnemies()
        {
            if (enemyPrefab == null || spawnPoints == null) return;
            
            foreach (Transform spawnPoint in spawnPoints)
            {
                GameObject enemy = Instantiate(enemyPrefab, spawnPoint.position, spawnPoint.rotation);
                enemiesRemaining++;
            }
        }

        private void CheckLevelCompletion()
        {
            // Count remaining alive enemies
            int aliveEnemies = 0;
            foreach (EnemyBase enemy in enemies)
            {
                if (enemy != null && !enemy.IsDead())
                    aliveEnemies++;
            }

            if (aliveEnemies != enemiesRemaining)
            {
                enemiesRemaining = aliveEnemies;
                UpdateObjective();
            }

            if (enemiesRemaining <= 0)
            {
                CompleteLevel();
            }
        }

        private void UpdateObjective()
        {
            if (hudManager != null)
                hudManager.SetObjectiveText($"{objective} ({enemiesRemaining} remaining)");
        }

        private void CompleteLevel()
        {
            if (hudManager != null)
                hudManager.SetObjectiveText("Level Complete!");
            
            Debug.Log("Level completed!");
            // TODO: Load next level or show completion screen
        }

        public void ActivateCheckpoint(int checkpointIndex)
        {
            if (checkpointIndex >= 0 && checkpointIndex < checkpoints.Length)
            {
                currentCheckpoint = checkpointIndex;
                Debug.Log($"Checkpoint {checkpointIndex} activated");
            }
        }

        public Vector3 GetCurrentCheckpoint()
        {
            if (currentCheckpoint >= 0 && currentCheckpoint < checkpoints.Length)
                return checkpoints[currentCheckpoint].position;
            
            return Vector3.zero;
        }
    }
}