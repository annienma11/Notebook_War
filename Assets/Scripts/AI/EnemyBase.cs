using UnityEngine;
using UnityEngine.AI;
using NotebookWar.Weapons;

namespace NotebookWar.AI
{
    public abstract class EnemyBase : MonoBehaviour, IDamageable
    {
        [Header("Enemy Stats")]
        [SerializeField] protected float maxHealth = 100f;
        [SerializeField] protected float moveSpeed = 3.5f;
        [SerializeField] protected float detectionRange = 15f;
        [SerializeField] protected float attackRange = 8f;
        [SerializeField] protected float damage = 20f;
        [SerializeField] protected float attackCooldown = 1.5f;

        [Header("AI Behavior")]
        [SerializeField] protected LayerMask playerLayer;
        [SerializeField] protected LayerMask obstacleLayer;
        
        protected float currentHealth;
        protected Transform player;
        protected NavMeshAgent agent;
        protected EnemyStateMachine stateMachine;
        protected float lastAttackTime;
        protected bool isDead = false;

        protected virtual void Awake()
        {
            currentHealth = maxHealth;
            agent = GetComponent<NavMeshAgent>();
            player = GameObject.FindGameObjectWithTag("Player")?.transform;
            
            if (agent != null)
            {
                agent.speed = moveSpeed;
            }

            InitializeStateMachine();
        }

        protected virtual void Start()
        {
            stateMachine?.Start();
        }

        protected virtual void Update()
        {
            if (isDead) return;
            
            stateMachine?.Update();
        }

        protected abstract void InitializeStateMachine();

        public virtual void TakeDamage(float damageAmount)
        {
            if (isDead) return;

            currentHealth -= damageAmount;
            
            OnDamageTaken(damageAmount);

            if (currentHealth <= 0)
            {
                Die();
            }
        }

        protected virtual void OnDamageTaken(float damage)
        {
            // Override in derived classes for specific damage reactions
        }

        protected virtual void Die()
        {
            isDead = true;
            
            if (agent != null)
                agent.enabled = false;

            OnDeath();
            
            // Disable after death animation/effects
            Invoke(nameof(DisableEnemy), 2f);
        }

        protected virtual void OnDeath()
        {
            // Override in derived classes for death effects
        }

        protected virtual void DisableEnemy()
        {
            gameObject.SetActive(false);
        }

        public virtual bool CanSeePlayer()
        {
            if (player == null) return false;

            float distanceToPlayer = Vector3.Distance(transform.position, player.position);
            if (distanceToPlayer > detectionRange) return false;

            Vector3 directionToPlayer = (player.position - transform.position).normalized;
            
            // Raycast to check for obstacles
            if (Physics.Raycast(transform.position + Vector3.up, directionToPlayer, distanceToPlayer, obstacleLayer))
            {
                return false;
            }

            return true;
        }

        public virtual bool IsPlayerInAttackRange()
        {
            if (player == null) return false;
            
            float distanceToPlayer = Vector3.Distance(transform.position, player.position);
            return distanceToPlayer <= attackRange;
        }

        public virtual bool CanAttack()
        {
            return Time.time >= lastAttackTime + attackCooldown && !isDead;
        }

        public virtual void Attack()
        {
            if (!CanAttack() || player == null) return;

            lastAttackTime = Time.time;
            PerformAttack();
        }

        protected abstract void PerformAttack();

        public virtual void MoveTo(Vector3 destination)
        {
            if (agent != null && agent.enabled && !isDead)
            {
                agent.SetDestination(destination);
            }
        }

        public virtual void StopMoving()
        {
            if (agent != null && agent.enabled)
            {
                agent.ResetPath();
            }
        }

        // Getters
        public float GetHealthPercentage() => currentHealth / maxHealth;
        public bool IsDead() => isDead;
        public Transform GetPlayer() => player;
        public NavMeshAgent GetAgent() => agent;
        public float GetDetectionRange() => detectionRange;
        public float GetAttackRange() => attackRange;

        protected virtual void OnDrawGizmosSelected()
        {
            // Visualize detection and attack ranges
            Gizmos.color = Color.yellow;
            Gizmos.DrawWireSphere(transform.position, detectionRange);
            
            Gizmos.color = Color.red;
            Gizmos.DrawWireSphere(transform.position, attackRange);
        }
    }
}