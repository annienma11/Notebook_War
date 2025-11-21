using UnityEngine;
using NotebookWar.Managers;

namespace NotebookWar.Level
{
    public class HotelLevel : MonoBehaviour
    {
        [Header("Hotel Configuration")]
        [SerializeField] private Transform[] elevatorPoints;
        [SerializeField] private Transform[] hostageLocations;
        [SerializeField] private GameObject hostagePrefab;
        
        [Header("Enemy Setup")]
        [SerializeField] private Transform[] shooterSpawns;
        [SerializeField] private Transform[] eliteSpawns;
        [SerializeField] private GameObject shooterEnemyPrefab;
        [SerializeField] private GameObject eliteEnemyPrefab;
        
        [Header("Interactive Elements")]
        [SerializeField] private GameObject elevatorPrefab;
        [SerializeField] private GameObject[] destructibleObjects;
        
        private LevelManager levelManager;
        private int hostagesRescued = 0;
        private int totalHostages = 3;

        private void Start()
        {
            levelManager = GetComponent<LevelManager>();
            SetupHotelLevel();
        }

        private void SetupHotelLevel()
        {
            SpawnEnemies();
            SpawnHostages();
            SetupElevators();
            SetupDestructibles();
        }

        private void SpawnEnemies()
        {
            // Spawn shooter enemies
            foreach (Transform spawn in shooterSpawns)
            {
                if (shooterEnemyPrefab != null)
                    Instantiate(shooterEnemyPrefab, spawn.position, spawn.rotation);
            }
            
            // Spawn elite enemies
            foreach (Transform spawn in eliteSpawns)
            {
                if (eliteEnemyPrefab != null)
                    Instantiate(eliteEnemyPrefab, spawn.position, spawn.rotation);
            }
        }

        private void SpawnHostages()
        {
            for (int i = 0; i < Mathf.Min(totalHostages, hostageLocations.Length); i++)
            {
                GameObject hostage = Instantiate(hostagePrefab, hostageLocations[i].position, hostageLocations[i].rotation);
                Hostage hostageScript = hostage.GetComponent<Hostage>();
                if (hostageScript != null)
                {
                    hostageScript.OnRescued += OnHostageRescued;
                }
            }
        }

        private void SetupElevators()
        {
            foreach (Transform elevatorPoint in elevatorPoints)
            {
                if (elevatorPrefab != null)
                    Instantiate(elevatorPrefab, elevatorPoint.position, elevatorPoint.rotation);
            }
        }

        private void SetupDestructibles()
        {
            // Destructible objects are already placed in scene
            foreach (GameObject obj in destructibleObjects)
            {
                if (obj.GetComponent<DestructibleObject>() == null)
                    obj.AddComponent<DestructibleObject>();
            }
        }

        private void OnHostageRescued()
        {
            hostagesRescued++;
            
            if (levelManager != null)
            {
                string objective = $"Rescue hostages ({hostagesRescued}/{totalHostages}) and clear enemies";
                levelManager.GetComponent<HUDManager>()?.SetObjectiveText(objective);
            }
            
            if (hostagesRescued >= totalHostages)
            {
                Debug.Log("All hostages rescued!");
            }
        }
    }

    public class Hostage : MonoBehaviour, IInteractable
    {
        [SerializeField] private GameObject rescueEffect;
        private bool isRescued = false;
        
        public System.Action OnRescued;

        public void Interact()
        {
            if (isRescued) return;
            
            isRescued = true;
            OnRescued?.Invoke();
            
            if (rescueEffect != null)
            {
                Instantiate(rescueEffect, transform.position, Quaternion.identity);
            }
            
            gameObject.SetActive(false);
        }
    }

    public class DestructibleObject : MonoBehaviour
    {
        [SerializeField] private float health = 50f;
        [SerializeField] private GameObject destroyEffect;
        [SerializeField] private GameObject[] spawnOnDestroy;
        
        public void TakeDamage(float damage)
        {
            health -= damage;
            
            if (health <= 0)
            {
                Destroy();
            }
        }

        private void Destroy()
        {
            if (destroyEffect != null)
            {
                Instantiate(destroyEffect, transform.position, transform.rotation);
            }
            
            foreach (GameObject spawn in spawnOnDestroy)
            {
                if (spawn != null)
                    Instantiate(spawn, transform.position, Quaternion.identity);
            }
            
            Destroy(gameObject);
        }
    }
}