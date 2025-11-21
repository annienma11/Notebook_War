using UnityEngine;
using NotebookWar.Managers;

namespace NotebookWar.Level
{
    public class ApartmentLevel : MonoBehaviour
    {
        [Header("Floor Configuration")]
        [SerializeField] private Transform[] floors;
        [SerializeField] private int enemiesPerFloor = 3;
        
        [Header("Spawn Points")]
        [SerializeField] private Transform[] floor1Spawns;
        [SerializeField] private Transform[] floor2Spawns;
        [SerializeField] private Transform[] floor3Spawns;
        
        [Header("Prefabs")]
        [SerializeField] private GameObject gruntEnemyPrefab;
        [SerializeField] private GameObject ammoPickupPrefab;
        [SerializeField] private GameObject medkitPrefab;
        
        private LevelManager levelManager;

        private void Start()
        {
            levelManager = GetComponent<LevelManager>();
            SetupApartmentLevel();
        }

        private void SetupApartmentLevel()
        {
            SpawnEnemiesOnFloor(floor1Spawns, enemiesPerFloor);
            SpawnEnemiesOnFloor(floor2Spawns, enemiesPerFloor);
            SpawnEnemiesOnFloor(floor3Spawns, enemiesPerFloor - 1); // Boss floor has fewer
            
            SpawnPickups();
        }

        private void SpawnEnemiesOnFloor(Transform[] spawnPoints, int count)
        {
            if (spawnPoints == null || gruntEnemyPrefab == null) return;
            
            for (int i = 0; i < Mathf.Min(count, spawnPoints.Length); i++)
            {
                Instantiate(gruntEnemyPrefab, spawnPoints[i].position, spawnPoints[i].rotation);
            }
        }

        private void SpawnPickups()
        {
            // Spawn medkit on each floor
            if (medkitPrefab != null)
            {
                foreach (Transform floor in floors)
                {
                    Vector3 pickupPos = floor.position + Vector3.right * 2f;
                    Instantiate(medkitPrefab, pickupPos, Quaternion.identity);
                }
            }
            
            // Spawn ammo pickups
            if (ammoPickupPrefab != null && floor2Spawns != null && floor2Spawns.Length > 0)
            {
                Vector3 ammoPos = floor2Spawns[0].position + Vector3.left * 3f;
                Instantiate(ammoPickupPrefab, ammoPos, Quaternion.identity);
            }
        }
    }
}