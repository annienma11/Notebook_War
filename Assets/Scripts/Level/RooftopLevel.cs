using UnityEngine;
using NotebookWar.AI;

namespace NotebookWar.Level
{
    public class RooftopLevel : MonoBehaviour
    {
        [Header("Rooftop Configuration")]
        [SerializeField] private Transform[] sniperPositions;
        [SerializeField] private Transform bossSpawnPoint;
        [SerializeField] private GameObject sniperEnemyPrefab;
        [SerializeField] private GameObject midBossPrefab;
        
        [Header("Environmental")]
        [SerializeField] private Transform[] poolAreas;
        [SerializeField] private GameObject[] coverObjects;
        
        private bool bossSpawned = false;
        private int enemiesKilled = 0;
        private int enemiesToKillBeforeBoss = 4;

        private void Start()
        {
            SetupRooftopLevel();
        }

        private void SetupRooftopLevel()
        {
            SpawnSnipers();
            SetupCover();
        }

        private void SpawnSnipers()
        {
            foreach (Transform sniperPos in sniperPositions)
            {
                if (sniperEnemyPrefab != null)
                {
                    GameObject sniper = Instantiate(sniperEnemyPrefab, sniperPos.position, sniperPos.rotation);
                    EnemyBase enemy = sniper.GetComponent<EnemyBase>();
                    if (enemy != null)
                    {
                        // Subscribe to death event to track kills
                    }
                }
            }
        }

        private void SetupCover()
        {
            foreach (GameObject cover in coverObjects)
            {
                if (cover.tag != "Cover")
                    cover.tag = "Cover";
            }
        }

        public void OnEnemyKilled()
        {
            enemiesKilled++;
            
            if (enemiesKilled >= enemiesToKillBeforeBoss && !bossSpawned)
            {
                SpawnMidBoss();
            }
        }

        private void SpawnMidBoss()
        {
            if (midBossPrefab != null && bossSpawnPoint != null)
            {
                bossSpawned = true;
                Instantiate(midBossPrefab, bossSpawnPoint.position, bossSpawnPoint.rotation);
                Debug.Log("Mid-boss spawned!");
            }
        }
    }

    public class MidBoss : EnemyBase
    {
        [Header("Boss Specific")]
        [SerializeField] private float chargeSpeed = 10f;
        [SerializeField] private float chargeRange = 15f;
        [SerializeField] private int phase = 1;
        
        private EnemyStateMachine stateMachine;
        private bool isCharging = false;

        protected override void InitializeStateMachine()
        {
            stateMachine = new EnemyStateMachine(this);
            maxHealth = 300f;
            currentHealth = maxHealth;
        }

        protected override void Update()
        {
            base.Update();
            CheckPhaseTransition();
        }

        private void CheckPhaseTransition()
        {
            float healthPercent = GetHealthPercentage();
            
            if (healthPercent <= 0.5f && phase == 1)
            {
                phase = 2;
                // Become more aggressive in phase 2
                moveSpeed *= 1.5f;
                damage *= 1.3f;
            }
        }

        protected override void PerformAttack()
        {
            if (player == null) return;
            
            float distance = Vector3.Distance(transform.position, player.position);
            
            if (distance <= chargeRange && !isCharging)
            {
                StartCoroutine(ChargeAttack());
            }
            else
            {
                // Regular melee attack
                base.PerformAttack();
            }
        }

        private System.Collections.IEnumerator ChargeAttack()
        {
            isCharging = true;
            Vector3 chargeDirection = (player.position - transform.position).normalized;
            
            float chargeTime = 1f;
            float elapsed = 0f;
            
            while (elapsed < chargeTime)
            {
                transform.position += chargeDirection * chargeSpeed * Time.deltaTime;
                elapsed += Time.deltaTime;
                yield return null;
            }
            
            // Deal damage if close to player
            if (Vector3.Distance(transform.position, player.position) <= attackRange)
            {
                IDamageable damageable = player.GetComponent<IDamageable>();
                if (damageable != null)
                {
                    damageable.TakeDamage(damage * 2f); // Charge does double damage
                }
            }
            
            isCharging = false;
        }

        public EnemyStateMachine GetStateMachine() => stateMachine;
    }
}